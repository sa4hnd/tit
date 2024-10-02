'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Subject {
  id: number;
  name: string;
}

interface Year {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newYearName, setNewYearName] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, yearsRes, coursesRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/years'),
        fetch('/api/courses'),
      ]);
      const [subjectsData, yearsData, coursesData] = await Promise.all([
        subjectsRes.json(),
        yearsRes.json(),
        coursesRes.json(),
      ]);
      setSubjects(subjectsData);
      setYears(yearsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubjectName }),
      });

      if (response.ok) {
        setNewSubjectName('');
        fetchData();
        toast.success('Subject added successfully');
      } else {
        toast.error('Failed to add subject');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('An error occurred while adding the subject');
    }
  };

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newYearName }),
      });

      if (response.ok) {
        setNewYearName('');
        fetchData();
        toast.success('Year added successfully');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add year: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding year:', error);
      toast.error('An error occurred while adding the year');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCourseName }),
      });

      if (response.ok) {
        setNewCourseName('');
        fetchData();
        toast.success('Course added successfully');
      } else {
        toast.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('An error occurred while adding the course');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-2xl font-bold mb-4'>
        Admin - Subjects, Years, and Courses
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Add New Subject</h2>
          <form onSubmit={handleAddSubject} className='space-y-4'>
            <Input
              type='text'
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder='Subject Name'
              className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
            />
            <Button type='submit' className='w-full'>
              Add Subject
            </Button>
          </form>
          <div className='mt-4'>
            <h3 className='text-white font-bold mb-2'>Existing Subjects:</h3>
            <ul className='list-disc list-inside text-white'>
              {subjects.map((subject) => (
                <li key={subject.id}>{subject.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Add New Year</h2>
          <form onSubmit={handleAddYear} className='space-y-4'>
            <Input
              type='text'
              value={newYearName}
              onChange={(e) => setNewYearName(e.target.value)}
              placeholder='Year'
              className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
            />
            <Button type='submit' className='w-full'>
              Add Year
            </Button>
          </form>
          <div className='mt-4'>
            <h3 className='text-white font-bold mb-2'>Existing Years:</h3>
            <ul className='list-disc list-inside text-white'>
              {years.map((year) => (
                <li key={year.id}>{year.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Add New Course</h2>
          <form onSubmit={handleAddCourse} className='space-y-4'>
            <Input
              type='text'
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder='Course Name'
              className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
            />
            <Button type='submit' className='w-full'>
              Add Course
            </Button>
          </form>
          <div className='mt-4'>
            <h3 className='text-white font-bold mb-2'>Existing Courses:</h3>
            <ul className='list-disc list-inside text-white'>
              {courses.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
