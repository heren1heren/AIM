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

    const assignment1 = await prisma.assignment.create({
        data: {
            class_id: class1.id,
            title: 'Assignment 1: Algebra Problems',
            description: 'Solve algebra problems',
            due_date: new Date('2026-09-15'),
            assignedDate: new Date('2026-09-10'),
        },
    });

    const assignment2 = await prisma.assignment.create({
        data: {
            class_id: class2.id,
            title: 'Assignment 1: Physics Problems',
            description: 'Solve physics problems',
            due_date: new Date('2026-09-20'),
            assignedDate: new Date('2026-09-12'),
        },
    });

    const content1 = await prisma.content.create({
        data: {
            class_id: class1.id,
            title: 'Lesson 1: Algebra Basics',
            description: 'Introduction to Algebra',
            urls: ['https://example.com/algebra-video'],
            assignedDate: new Date('2026-09-05'),
        },
    });

    const content2 = await prisma.content.create({
        data: {
            class_id: class2.id,
            title: 'Lesson 1: Physics Basics',
            description: 'Introduction to Physics',
            urls: ['https://example.com/physics-video'],
            assignedDate: new Date('2026-09-06'),
        },
    });

    const file1 = await prisma.file.create({
        data: {
            key: 'math-syllabus-12345.pdf',
            filename: 'Algebra Syllabus',
            mimetype: 'application/pdf',
            size: 1024,
            uploaded_by: user2.id,
            class_id: class1.id,
        },
    });

    const file2 = await prisma.file.create({
        data: {
            key: 'physics-syllabus-67890.pdf',
            filename: 'Physics Syllabus',
            mimetype: 'application/pdf',
            size: 2048,
            uploaded_by: user1.id,
            class_id: class2.id,
        },
    });

    const avatarFile1 = await prisma.file.create({
        data: {
            key: 'avatar-user1.png',
            filename: 'avatar-user1.png',
            mimetype: 'image/png',
            size: 512,
            uploaded_by: user1.id,
        },
    });

    const avatarFile2 = await prisma.file.create({
        data: {
            key: 'avatar-user2.png',
            filename: 'avatar-user2.png',
            mimetype: 'image/png',
            size: 512,
            uploaded_by: user2.id,
        },
    });

    console.log('Database has been seeded with class instances, assignments, content, and files!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });