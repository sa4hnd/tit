'use client';

import { getAnalytics, logEvent } from 'firebase/analytics';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { withAdminAuth } from '@/components/withAdminAuth';

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

interface Question {
  id: number;
  text: string;
  options: string;
  answer: string;
}

function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const analytics = getAnalytics(app);

  useEffect(() => {
    fetchSubjects();
    fetchYears();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedYear && selectedCourse) {
      fetchQuestions();
    }
  }, [selectedSubject, selectedYear, selectedCourse]);

  const fetchSubjects = async () => {
    const response = await fetch('/api/subjects');
    const data = await response.json();
    setSubjects(data);
  };

  const fetchYears = async () => {
    const response = await fetch('/api/years');
    const data = await response.json();
    setYears(data);
  };

  const fetchCourses = async () => {
    const response = await fetch('/api/courses');
    const data = await response.json();
    setCourses(data);
  };

  const fetchQuestions = async () => {
    const response = await fetch(
      `/api/questions?subjectId=${selectedSubject}&yearId=${selectedYear}&courseId=${selectedCourse}`
    );
    const data = await response.json();
    setQuestions(data);
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const handleAddSubject = async () => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject }),
      });
      if (response.ok) {
        toast.success('New subject added successfully');
        fetchSubjects();
        setNewSubject('');
        logEvent(analytics, 'admin_add_subject', { subject: newSubject });
      } else {
        throw new Error('Failed to add new subject');
      }
    } catch (error) {
      console.error('Error adding new subject:', error);
      toast.error('Failed to add new subject');
      logEvent(analytics, 'admin_add_subject_error', {
        subject: newSubject,
        error: (error as Error).message,
      });
    }
  };

  const handleAddYear = async () => {
    try {
      const response = await fetch('/api/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newYear }),
      });
      if (response.ok) {
        toast.success('New year added successfully');
        fetchYears();
        setNewYear('');
        logEvent(analytics, 'admin_add_year', { year: newYear });
      } else {
        throw new Error('Failed to add new year');
      }
    } catch (error) {
      console.error('Error adding new year:', error);
      toast.error('Failed to add new year');
      logEvent(analytics, 'admin_add_year_error', {
        year: newYear,
        error: (error as Error).message,
      });
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCourse }),
      });
      if (response.ok) {
        toast.success('New course added successfully');
        fetchCourses();
        setNewCourse('');
        logEvent(analytics, 'admin_add_course', { course: newCourse });
      } else {
        throw new Error('Failed to add new course');
      }
    } catch (error) {
      console.error('Error adding new course:', error);
      toast.error('Failed to add new course');
      logEvent(analytics, 'admin_add_course_error', {
        course: newCourse,
        error: (error as Error).message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: questionText,
          options: JSON.stringify(options), // Make sure this is a valid JSON string
          answer: options[parseInt(correctAnswer)],
          subjectId: parseInt(selectedSubject),
          yearId: parseInt(selectedYear),
          courseId: parseInt(selectedCourse),
        }),
      });
      if (response.ok) {
        toast.success('Question added successfully');
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        fetchQuestions();
        logEvent(analytics, 'admin_add_question');
      } else {
        throw new Error('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
      logEvent(analytics, 'admin_add_question_error', {
        error: (error as Error).message,
      });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-4xl font-bold mb-8'>Admin Dashboard</h1>
      <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
        {/* Add new subject */}
        <div className='mb-6'>
          <h2 className='text-white text-2xl font-bold mb-4'>
            Add New Subject
          </h2>
          <div className='flex items-center'>
            <Input
              type='text'
              placeholder='Enter new subject'
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className='mr-4'
            />
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </div>
        </div>

        {/* Add new year */}
        <div className='mb-6'>
          <h2 className='text-white text-2xl font-bold mb-4'>Add New Year</h2>
          <div className='flex items-center'>
            <Input
              type='text'
              placeholder='Enter new year'
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className='mr-4'
            />
            <Button onClick={handleAddYear}>Add Year</Button>
          </div>
        </div>

        {/* Add new course */}
        <div className='mb-6'>
          <h2 className='text-white text-2xl font-bold mb-4'>Add New Course</h2>
          <div className='flex items-center'>
            <Input
              type='text'
              placeholder='Enter new course'
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className='mr-4'
            />
            <Button onClick={handleAddCourse}>Add Course</Button>
          </div>
        </div>

        {/* Add new question */}
        <div className='mb-6'>
          <h2 className='text-white text-2xl font-bold mb-4'>
            Add New Question
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Subject' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Course' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type='text'
              placeholder='Question text'
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />

            {options.map((option, index) => (
              <Input
                key={index}
                type='text'
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
            ))}

            <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Correct Answer' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Option {index + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type='submit'>Add Question</Button>
          </form>
        </div>

        {/* Display questions */}
        <div>
          <h2 className='text-white text-2xl font-bold mb-4'>
            Manage Questions
          </h2>
          {questions.length > 0 ? (
            <ul>
              {questions.map((question) => (
                <li key={question.id} className='text-white mb-2'>
                  {question.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-white'>
              No questions found for the selected criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminPage);
