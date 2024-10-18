import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
    const [studentsCount, setStudentsCount] = useState(0);
    const [teachersCount, setTeachersCount] = useState(0);
    const [expertCount, setExpertCount] = useState(0);
    const [advisorCount, setAdvisorCount] = useState(0);
    const [chairmanCount, setChairmanCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [projectTypeData, setProjectTypeData] = useState({ labels: [], datasets: [] });
    const [projectTypeBarData, setProjectTypeBarData] = useState({ labels: [], datasets: [] });
    const [registrationData, setRegistrationData] = useState({ labels: [], datasets: [] });
    const [projectYear, setProjectYear] = useState('2566'); // Default year
    const [projectYearOptions] = useState(['2566', '2567']); // Year options

    useEffect(() => {
        const fetchStudentCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/auth/student-count');
                setStudentsCount(response.data.count);
            } catch (error) {
                console.error('Error fetching student count:', error);
            }
        };

        const fetchExpertCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/expert/count');
                setExpertCount(response.data.expertCount);
            } catch (error) {
                console.error('Error fetching expert count:', error);
            }
        };

        const fetchAdvisorCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/advisor/count');
                setAdvisorCount(response.data.advisorCount);
            } catch (error) {
                console.error('Error fetching expert count:', error);
            }
        };

        const fetchChairmanCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/chairman/count');
                setChairmanCount(response.data.chairmanCount);
            } catch (error) {
                console.error('Error fetching expert count:', error);
            }
        };

        const fetchTeacherCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/auth/teacher-count');
                setTeachersCount(response.data.count);
            } catch (error) {
                console.error('Error fetching teacher count:', error);
            }
        };

        const fetchProjectsCount = async () => {
            try {
                const response = await axios.get('http://localhost:9999/project/project-count');
                setProjectsCount(response.data.totalProjects);
            } catch (error) {
                console.error('Error fetching projects count:', error);
            }
        };

        const fetchProjectTypeDataByYear = async (year) => {
            try {
                const response = await axios.get(`http://localhost:9999/project/project-year-counts`);
                console.log(response.data); // Log the response to inspect its structure
        
                const yearData = response.data[year]; // Fetch data for the selected year
        
                // Check if there is data for the selected year
                if (yearData && Object.keys(yearData).length > 0) {
                    const labels = Object.keys(yearData); // Get project types (keys)
                    const data = Object.values(yearData); // Get project counts (values)
        
                    // Set the pie chart data if year data exists
                    setProjectTypeData({
                        labels: labels,
                        datasets: [{
                            label: `ประเภทโครงงาน ปี ${year}`,
                            data: data,
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                        }]
                    });
                } else {
                    // If no data, set an empty chart
                    setProjectTypeData({
                        labels: [],
                        datasets: []
                    });
                    console.log(`No data found for year ${year}`);
                }
            } catch (error) {
                console.error('Error fetching project type data by year:', error);
                // Handle the case where an error occurs
                setProjectTypeData({
                    labels: [],
                    datasets: []
                });
            }
        };
        

        const fetchProjectTypeBarData = async () => {
    try {
        const response = await axios.get('http://localhost:9999/project/project-type-counts');
        const labels = response.data.map(item => `${item.type} (${item.count})`);
        const data = response.data.map(item => item.count);

        setProjectTypeBarData({
            labels: labels,
            datasets: [{
                label: 'จำนวนโครงงานตามประเภท',
                data: data,
                backgroundColor: '#4BC0C0',
            }]
        });
    } catch (error) {
        console.error('Error fetching project type data:', error);
    }
};

        const fetchRegistrationData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/auth/registration-counts');
                const labels = response.data.map(item => item.date);
                const studentData = response.data.map(item => item.studentCount);
                const teacherData = response.data.map(item => item.teacherCount);
                setRegistrationData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'จำนวนนักศึกษาที่สมัคร',
                            data: studentData,
                            backgroundColor: '#36A2EB',
                        },
                        {
                            label: 'จำนวนอาจารย์ที่สมัคร',
                            data: teacherData,
                            backgroundColor: '#FF6384',
                        },
                    ]
                });
            } catch (error) {
                console.error('Error fetching registration data:', error);
            }
        };

        fetchStudentCount();
        fetchTeacherCount();
        fetchProjectsCount();
        fetchExpertCount();
        fetchAdvisorCount();
        fetchChairmanCount();
        fetchProjectTypeDataByYear(projectYear); // Fetch pie chart data based on the selected year
        fetchProjectTypeBarData(); // Fetch bar chart data
        fetchRegistrationData();
    }, [projectYear]);

    return (
        <div className="bg-blue-50 min-h-screen p-6 pl-72">
            <header className="bg-blue-600 text-white p-4 rounded shadow-md mb-6">
                <h1 className="text-3xl font-bold text-center">แดชบอร์ด</h1>
            </header>
            <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards */}
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                            <i className="fas fa-users fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">นักศึกษา</h2>
                        <p className="text-gray-600 mt-2">นักศึกษาทั้งหมดในระบบ: {studentsCount}</p>
                        <p>(สมาชิก)</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                            <i className="fas fa-chalkboard-teacher fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">อาจารย์</h2>
                        <p className="text-gray-600 mt-2">อาจารย์ทั้งหมดในระบบ: {teachersCount}</p>
                        <p>(สมาชิก)</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                            <i className="fas fa-project-diagram fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">โครงงาน</h2>
                        <p className="text-gray-600 mt-2">โครงงานทั้งหมดในระบบ: {projectsCount}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                            <i className="fas fa-user-tie fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">อาจารย์ที่ปรึกษา</h2>
                        <p className="text-gray-600 mt-2">อาจารย์ที่ปรึกษาทั้งหมดในระบบ: {advisorCount}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                            <i className="fas fa-user-tie fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">ประธาน</h2>
                        <p className="text-gray-600 mt-2">ประธานทั้งหมดในระบบ: {chairmanCount}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out">
                        <div className="bg-blue-500 text-white p-4 rounded-full">
                        <i className="fas fa-user-tie fa-2x"></i>
                        </div>
                        <h2 className="text-xl font-semibold mt-4">ผู้ทรงคุณวุฒิ</h2>
                        <p className="text-gray-600 mt-2">ผู้ทรงคุณวุฒิทั้งหมดในระบบ: {expertCount}</p>
                    </div>

                    
                </div>

                {/* Year Selector */}
                <div className="mt-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">เลือกปีการศึกษา:</label>
                    <select
                        value={projectYear}
                        onChange={(e) => setProjectYear(e.target.value)}
                        className="p-2 border rounded"
                    >
                        {projectYearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Charts */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition duration-300 ease-in-out">
                        <h2 className="text-xl font-bold text-center mb-4">กราฟวงกลมแสดงจำนวนโครงงานตามประเภท ปี {projectYear}</h2>
                        <div className="flex justify-center">
                            <div className="w-10/12">
                                <Pie data={projectTypeData} />
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition duration-300 ease-in-out">
                        <h2 className="text-xl font-bold text-center mb-4">กราฟแท่งแสดงจำนวนโครงงานทั้งหมดตามประเภท</h2>
                        <div className="flex justify-center">
                            <div className="w-10/12">
                                <Bar data={projectTypeBarData} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
