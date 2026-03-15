import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    });

    const teacher2 = await prisma.user.create({
        data: {
            name: 'Teacher Two',
            username: 'teacher2',
            password_hash: 'hashed_password_teacher2',
            role: 'teacher',
            teacher: { create: {} },
        },
    });

    const teacher3 = await prisma.user.create({
        data: {
            name: 'Teacher Three',
            username: 'teacher3',
            password_hash: 'hashed_password_teacher3',
            role: 'teacher',
            teacher: { create: {} },
        },
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
    });

    const student2 = await prisma.user.create({
        data: {
            name: 'Student Two',
            username: 'student2',
            password_hash: 'hashed_password_student2',
            role: 'student',
            student: { create: {} },
        },
    });

    const student3 = await prisma.user.create({
        data: {
            name: 'Student Three',
            username: 'student3',
            password_hash: 'hashed_password_student3',
            role: 'student',
            student: { create: {} },
        },
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
            students: { connect: [{ id: student2.student.id }, { id: student3.student.id }] },
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

    // Create Assignments
    const assignment1 = await prisma.assignment.create({
        data: {
            title: 'Algebra Homework',
            description: 'Solve 10 algebra problems',
            due_date: new Date('2026-03-15'),
            class: { connect: { id: class1.id } },
        },
    });

    const assignment2 = await prisma.assignment.create({
        data: {
            title: 'Newton’s Laws',
            description: 'Write a report on Newton’s Laws of Motion',
            due_date: new Date('2026-03-20'),
            class: { connect: { id: class2.id } },
        },
    });

    const assignment3 = await prisma.assignment.create({
        data: {
            title: 'Periodic Table Quiz',
            description: 'Answer 20 questions about the periodic table',
            due_date: new Date('2026-03-25'),
            class: { connect: { id: class3.id } },
        },
    });

    // Create Submissions
    await prisma.submission.create({
        data: {
            content: 'Answers to algebra problems...',
            submitted_at: new Date(),
            grade: 85,
            feedback: 'Good work!',
            assignment: { connect: { id: assignment1.id } },
            student: { connect: { id: student1.student.id } },
        },
    });

    await prisma.submission.create({
        data: {
            content: 'Report on Newton’s Laws...',
            submitted_at: new Date(),
            grade: null, // No grade yet
            feedback: null, // No feedback yet
            assignment: { connect: { id: assignment2.id } },
            student: { connect: { id: student2.student.id } },
        },
    });

    await prisma.submission.create({
        data: {
            content: 'Answers to periodic table quiz...',
            submitted_at: new Date(),
            grade: 90,
            feedback: 'Excellent!',
            assignment: { connect: { id: assignment3.id } },
            student: { connect: { id: student3.student.id } },
        },
    });

    // Create Notifications
    await prisma.notification.create({
        data: {
            title: 'Welcome to Math 101',
            message: 'Your first assignment has been posted!',
            created_by: admin1.id,
            notification_targets: {
                create: [
                    {
                        role: 'students',
                        class: { connect: { id: class1.id } },
                    },
                ],
            },
        },
    });

    await prisma.notification.create({
        data: {
            title: 'Physics Class Update',
            message: 'Class will be held online tomorrow.',
            created_by: admin2.id,
            notification_targets: {
                create: [
                    {
                        role: 'teachers',
                    },
                ],
            },
        },
    });

    await prisma.notification.create({
        data: {
            title: 'System Maintenance',
            message: 'The system will be down for maintenance tonight.',
            created_by: admin3.id,
            notification_targets: {
                create: [
                    {
                        role: 'all',
                    },
                ],
            },
        },
    });

    await prisma.notification.create({
        data: {
            title: 'Chemistry Assignment Reminder',
            message: 'Don’t forget to submit your assignment!',
            created_by: admin1.id,
            notification_targets: {
                create: [
                    {
                        class: { connect: { id: class3.id } },
                    },
                ],
            },
        },
    });

    console.log('Database has been seeded with sample data!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });