import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding new data...');

    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);
    const hashedPassword3 = await bcrypt.hash('password123', 10);
    const hashedPasswordStudent1 = await bcrypt.hash('password123', 10);
    const hashedPasswordStudent2 = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            name: 'User One',
            username: 'user1',
            password_hash: hashedPassword1,
            created_at: new Date(),
            admin: { create: {} },
            teacher: { create: {} },
            bio: 'neutral',
        },
        include: {
            admin: true,
            teacher: true,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'User Two',
            username: 'user2',
            password_hash: hashedPassword2,
            created_at: new Date(),
            teacher: { create: {} },
            bio: 'positive',
        },
        include: {
            teacher: true,
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'User Three',
            username: 'user3',
            password_hash: hashedPassword3,
            created_at: new Date(),
            admin: { create: {} },
            bio: 'neutral',
        },
        include: {
            admin: true,
        },
    });

    const student1 = await prisma.user.create({
        data: {
            name: 'Student One',
            username: 'student1',
            password_hash: hashedPasswordStudent1,
            created_at: new Date(),
            student: { create: {} },
            bio: 'curious',
        },
        include: {
            student: true,
        },
    });

    const student2 = await prisma.user.create({
        data: {
            name: 'Student Two',
            username: 'student2',
            password_hash: hashedPasswordStudent2,
            created_at: new Date(),
            student: { create: {} },
            bio: 'curious',
        },
        include: {
            student: true,
        },
    });

    const class1 = await prisma.class.create({
        data: {
            name: 'Math 10-1',
            description: 'Introduction to Algebra',
            teacher_id: user2.teacher.id,
            start_date: new Date('2026-09-01'),
            end_date: new Date('2026-12-15'),
        },
    });

    const class2 = await prisma.class.create({
        data: {
            name: 'Science 10-1',
            description: 'Introduction to Physics',
            teacher_id: user1.teacher.id,
            start_date: new Date('2026-09-01'),
            end_date: new Date('2026-12-15'),
        },
    });

    // Create notifications and associate them with recipients and classes
    const notifications = [
        {
            title: 'Welcome to the platform!',
            message: 'We are excited to have you here. Let us know if you need any help!',
            created_by: user1.id,
            is_global: true,
            classes: {
                connect: [{ id: class1.id }, { id: class2.id }], // Associate with both classes
            },
            recipients: {
                connect: [
                    { id: student1.id },
                    { id: student2.id },
                    { id: user2.id }, // Teacher of class1
                    { id: user1.id }, // Teacher of class2
                ],
            },
        },
        {
            title: 'Upcoming Event',
            message: 'Don’t forget about the upcoming event next week!',
            created_by: user1.id,
            is_for_students: true,
            classes: {
                connect: [{ id: class1.id }], // Associate with class1 only
            },
            recipients: {
                connect: [
                    { id: student1.id }, // Student in class1
                    { id: student2.id }, // Student in class1
                ],
            },
        },
        {
            title: 'System Update',
            message: 'The platform will undergo maintenance tomorrow from 12 AM to 2 AM.',
            created_by: user1.id,
            is_global: true,
            classes: {
                connect: [{ id: class2.id }], // Associate with class2 only
            },
            recipients: {
                connect: [
                    { id: student1.id },
                    { id: student2.id },
                    { id: user2.id }, // Teacher of class1
                    { id: user1.id }, // Teacher of class2
                ],
            },
        },
    ];

    for (const notification of notifications) {
        await prisma.notification.create({
            data: notification,
        });
    }

    console.log('Database has been seeded with notifications, recipients, and classes!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });