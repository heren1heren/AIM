import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding new data...');

    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);
    const hashedPassword3 = await bcrypt.hash('password123', 10);
    const hashedPasswordStudent1 = await bcrypt.hash('password123', 10);
    const hashedPasswordStudent2 = await bcrypt.hash('password123', 10);

    // Create Users with Admin and Teacher Roles
    const user1 = await prisma.user.create({
        data: {
            name: 'User One',
            username: 'user1',
            password_hash: hashedPassword1,
            created_at: new Date(),
            admin: { create: {} }, // Assign Admin role
            teacher: { create: {} }, // Assign Teacher role
            avatarUrl: 'https://example.com/avatar-user1.png',
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
            teacher: { create: {} }, // Assign Teacher role only
            avatarUrl: 'https://example.com/avatar-user2.png',
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
            admin: { create: {} }, // Assign Admin role only
            avatarUrl: 'https://example.com/avatar-user3.png',
            bio: 'neutral',
        },
        include: {
            admin: true,
        },
    });

    // Create Student Users (Single Role Only)
    const student1 = await prisma.user.create({
        data: {
            name: 'Student One',
            username: 'student1',
            password_hash: hashedPasswordStudent1,
            created_at: new Date(),
            student: { create: {} }, // Assign Student role
            avatarUrl: 'https://example.com/avatar-student1.png',
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
            student: { create: {} }, // Assign Student role
            avatarUrl: 'https://example.com/avatar-student2.png',
            bio: 'curious',
        },
        include: {
            student: true,
        },
    });

    // Create Class Instances
    const class1 = await prisma.class.create({
        data: {
            name: 'Math 10-1',
            description: 'Introduction to Algebra',
            teacher_id: user2.teacher.id, // Assign Teacher (User Two)
            start_date: new Date('2026-09-01'),
            end_date: new Date('2026-12-15'),
        },
    });

    const class2 = await prisma.class.create({
        data: {
            name: 'Science 10-1',
            description: 'Introduction to Physics',
            teacher_id: user1.teacher.id, // Assign Teacher (User One)
            start_date: new Date('2026-09-01'),
            end_date: new Date('2026-12-15'),
        },
    });

    // Create Assignment Instances
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

    // Create Content Instances
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

    // Create File Instances
    const file1 = await prisma.file.create({
        data: {
            url: 'https://example.com/file1.pdf',
            filename: 'Algebra Syllabus',
            mimetype: 'application/pdf',
            size: 1024,
            uploaded_by: user2.id, // Uploaded by Teacher (User Two)
            class_id: class1.id,
        },
    });

    const file2 = await prisma.file.create({
        data: {
            url: 'https://example.com/file2.pdf',
            filename: 'Physics Syllabus',
            mimetype: 'application/pdf',
            size: 2048,
            uploaded_by: user1.id, // Uploaded by Teacher (User One)
            class_id: class2.id,
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