'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function AddQuestionPage() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [yearId, setYearId] = useState('');
  const [courseId, setCourseId] = useState('');
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        options: JSON.stringify(options),
        answer,
        subjectId: parseInt(subjectId),
        yearId: parseInt(yearId),
        courseId: parseInt(courseId),
      }),
    });

    if (response.ok) {
      router.push('/admin/questions');
    } else {
      console.error('Failed to add question');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-2xl font-bold mb-4'>Add New Question</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Question text'
          className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
        />
        {options.map((option, index) => (
          <input
            key={index}
            type='text'
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
          />
        ))}
        <input
          type='text'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder='Correct answer'
          className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'
        />
        <Select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          placeholder='Select Subject'
        >
          {/* Fetch and map subjects here */}
        </Select>
        <Select
          value={yearId}
          onChange={(e) => setYearId(e.target.value)}
          placeholder='Select Year'
        >
          {/* Fetch and map years here */}
        </Select>
        <Select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder='Select Course'
        >
          {/* Fetch and map courses here */}
        </Select>
        <Button type='submit'>Add Question</Button>
      </form>
    </div>
  );
}
