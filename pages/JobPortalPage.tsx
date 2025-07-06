import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockJobs } from '../data/mockData';
import { Job, UserRole } from '../types';

const JobCard: React.FC<{ job: Job; onApply: (jobId: number) => void; canApply: boolean }> = ({ job, onApply, canApply }) => (
  <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
    <div className="p-6">
      <div className="flex items-start gap-4">
        <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-lg object-cover" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
          <p className="text-md text-gray-600 dark:text-gray-400">{job.companyName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{job.location}</p>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Job Desk:</h4>
        <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400 space-y-1">
          {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
        </ul>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold text-green-500">Rp {job.salary.toLocaleString()}</p>
        {canApply && <button onClick={() => onApply(job.id)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Apply Now</button>}
      </div>
    </div>
  </div>
);

const JobPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState(50000000);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
  
  const handleApply = (jobId: number) => {
    alert(`Applying for Job ID: ${jobId}. In a real app, your CV would be sent!`);
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => 
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      job.salary >= salaryRange
    );
  }, [searchTerm, salaryRange]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Find Your Next Opportunity</h1>
      
      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-navy-900 rounded-xl shadow-md">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Keywords</label>
          <input
            id="search"
            type="text"
            placeholder="Job title or company"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-navy-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-navy-800 p-3"
          />
        </div>
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Salary: Rp {salaryRange.toLocaleString()}
          </label>
          <input
            id="salary"
            type="range"
            min="0"
            max="50000000"
            step="1000000"
            value={salaryRange}
            onChange={e => { setSalaryRange(Number(e.target.value)); setCurrentPage(1); }}
            className="mt-1 w-full h-2 bg-gray-200 dark:bg-navy-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Job Listings */}
      {currentJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
            {currentJobs.map(job => (
                <JobCard key={job.id} job={job} onApply={handleApply} canApply={user?.role === UserRole.CLIENT} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No jobs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
        </div>
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-navy-800 rounded-md disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-navy-800 rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
};

export default JobPortalPage;
