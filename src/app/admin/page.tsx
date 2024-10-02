'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface Question {
  id: number;
  text: string;
  options: string;
  answer: string;
}

export default function AdminPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: questionText,
        options: JSON.stringify(options),
        answer: correctAnswer,
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
    } else {
      toast.error('Failed to add question');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-3xl font-bold mb-8'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>
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
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder='Question text'
              className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
            />
            {options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
              />
            ))}
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder='Correct answer'
              className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
            />
            <Button type='submit' className='w-full'>
              Add Question
            </Button>
          </form>
        </div>
        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>
            Manage Questions
          </h2>
          <div className='space-y-4'>
            {questions.length > 0 ? (
              questions.map((question) => (
                <div
                  key={question.id}
                  className='bg-white bg-opacity-10 rounded-xl p-4'
                >
                  <p className='text-white mb-2'>{question.text}</p>
                </div>
              ))
            ) : (
              <p className='text-white'>
                No questions found for the selected criteria.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
