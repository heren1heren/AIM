import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    console.log('Seeding new data...');

    // Create Admin Users
    const admin1 = await prisma.user.create({
        data: {
            name: 'Admin One',
            username: 'admin1',
            password_hash: 'hashed_password_admin1',
            role: 'admin',
            admin: { create: {} },
        },
    });

    const admin2 = await prisma.user.create({
        data: {
            name: 'Admin Two',
            username: 'admin2',
            password_hash: 'hashed_password_admin2',
            role: 'admin',
            admin: { create: {} },
        },
    });

    const admin3 = await prisma.user.create({
        data: {
            name: 'Admin Three',
            username: 'admin3',
            password_hash: 'hashed_password_admin3',
            role: 'admin',
            admin: { create: {} },
        },
    });

    // Create Teacher Users
    const teacher1 = await prisma.user.create({
        data: {
            name: 'Teacher One',
            username: 'teacher1',
            password_hash: 'hashed_password_teacher1',
            role: 'teacher',
            teacher: { create: {} },
        },
        include: { teacher: true },
    });

    const teacher2 = await prisma.user.create({
        data: {
            name: 'Teacher Two',
            username: 'teacher2',
            password_hash: 'hashed_password_teacher2',
            role: 'teacher',
            teacher: { create: {} },
        },
        include: { teacher: true },
    });

    const teacher3 = await prisma.user.create({
        data: {
            name: 'Teacher Three',
            username: 'teacher3',
            password_hash: 'hashed_password_teacher3',
            role: 'teacher',
            teacher: { create: {} },
        },
        include: { teacher: true },
    });

    // Create Student Users
    const student1 = await prisma.user.create({
        data: {
            name: 'Student One',
            username: 'student1',
            password_hash: 'hashed_password_student1',
            role: 'student',
            student: { create: {} },
        },
        include: { student: true },
    });

    const student2 = await prisma.user.create({
        data: {
            name: 'Student Two',
            username: 'student2',
            password_hash: 'hashed_password_student2',
            role: 'student',
            student: { create: {} },
        },
        include: { student: true },
    });

    const student3 = await prisma.user.create({
        data: {
            name: 'Student Three',
            username: 'student3',
            password_hash: 'hashed_password_student3',
            role: 'student',
            student: { create: {} },
        },
        include: { student: true },
    });

    // Create Classes
    const class1 = await prisma.class.create({
        data: {
            name: 'Math 101',
            description: 'Introduction to Mathematics',
            teacher: { connect: { id: teacher1.teacher.id } },
            students: { connect: [{ id: student1.student.id }, { id: student2.student.id }] },
        },
    });

    const class2 = await prisma.class.create({
        data: {
            name: 'Physics 101',
            description: 'Introduction to Physics',
            teacher: { connect: { id: teacher2.teacher.id } },
            students: { connect: [{ id: student2.student.id }] },
        },
    });

    const class3 = await prisma.class.create({
        data: {
            name: 'Chemistry 101',
            description: 'Introduction to Chemistry',
            teacher: { connect: { id: teacher3.teacher.id } },
            students: { connect: [{ id: student1.student.id }, { id: student3.student.id }] },
        },
    });

    // Create Content for Classes
    const content1 = await prisma.content.create({
        data: {
            title: 'Lesson 1: Algebra Basics',
            description: 'This lesson covers the basics of algebra.',
            urls: [
                'https://example.com/algebra-video',
                'https://example.com/algebra-notes',
            ],
            class: { connect: { id: class1.id } },
            files: {
                create: [
                    {
                        url: 'https://example.com/file1.pdf',
                        filename: 'Algebra Notes',
                        mimetype: 'application/pdf',
                        size: 1024,
                        uploaded_by: teacher1.id,
                    },
                    {
                        url: 'https://example.com/file2.mp4',
                        filename: 'Algebra Video',
                        mimetype: 'video/mp4',
                        size: 2048,
                        uploaded_by: teacher1.id,
                    },
                ],
            },
        },
    });

    const content2 = await prisma.content.create({
        data: {
            title: 'Lesson 1: Newton’s Laws',
            description: 'An introduction to Newton’s Laws of Motion.',
            urls: [
                'https://example.com/newton-video',
                'https://example.com/newton-notes',
            ],
            class: { connect: { id: class2.id } },
            files: {
                create: [
                    {
                        url: 'https://example.com/file3.pdf',
                        filename: 'Newton Notes',
                        mimetype: 'application/pdf',
                        size: 512,
                        uploaded_by: teacher2.id,
                    },
                ],
            },
        },
    });

    console.log('Database has been seeded with sample data, including content!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });