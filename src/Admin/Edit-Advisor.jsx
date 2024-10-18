import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function EditAdvisor() {
  const { id_advisor } = useParams(); // Get the advisor ID from the URL params
  const [advisorTitle, setAdvisorTitle] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [advisorLastName, setAdvisorLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  // List of branches for the dropdown
  const branches = [
    'เทคโนโลยีสารสนเทศ',
    'เทคโนโลยีมัลติมีเดียและแอนิเมชั่น',
    'เทคโนโลยีสารสนเทศภูมิศาสตร์',
    'เทคโนโลยีคอมพิวเตอร์และการจัดการสื่อสาร',
    'การจัดการเทคโนโลยีสารสนเทศ',
    // Add more branches as needed
  ];

  // Fetch the current advisor data when the component loads
  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/advisor/getById/${id_advisor}`);
        
        // Check if response.data.advisor exists and has the necessary fields
        const advisorData = response.data.advisor;

        if (advisorData) {
          const { advisor_title, advisor_name, advisor_lastname, branch, group, phone_number, email } = advisorData;
          setAdvisorTitle(advisor_title);
          setAdvisorName(advisor_name);
          setAdvisorLastName(advisor_lastname);
          setBranch(branch);
          setGroup(group);
          setPhoneNumber(phone_number);
          setEmail(email);
        } else {
          throw new Error('Advisor data is not available');
        }
      } catch (error) {
        console.error('Error fetching advisor:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลที่ปรึกษาได้',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    };

    fetchAdvisor();
  }, [id_advisor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:9999/advisor/update`, { 
        id_advisor, // ส่ง id_advisor ไปด้วย
        advisor_title: advisorTitle,
        advisor_name: advisorName,
        advisor_lastname: advisorLastName,
        branch,
        group,
        phone_number: phoneNumber,
        email: email
      });

      Swal.fire({
        title: 'สำเร็จ',
        text: response.data.msg,
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });

      navigate('/advisor'); // Navigate back to the advisor list
    } catch (error) {
      console.error('Error updating advisor:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pl-72">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-4">อัปเดตข้อมูลที่ปรึกษา</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          แก้ไขข้อมูลที่ปรึกษาในฟอร์มด้านล่าง
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="advisorTitle" className="sr-only">ตำแหน่งที่ปรึกษา</label>
            <input
              id="advisorTitle"
              name="advisorTitle"
              type="text"
              value={advisorTitle}
              onChange={(e) => setAdvisorTitle(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ตำแหน่งที่ปรึกษา"
              required
            />
          </div>
          <div>
            <label htmlFor="advisorName" className="sr-only">ชื่อ</label>
            <input
              id="advisorName"
              name="advisorName"
              type="text"
              value={advisorName}
              onChange={(e) => setAdvisorName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="ชื่อ"
              required
            />
          </div>
          <div>
            <label htmlFor="advisorLastName" className="sr-only">นามสกุล</label>
            <input
              id="advisorLastName"
              name="advisorLastName"
              type="text"
              value={advisorLastName}
              onChange={(e) => setAdvisorLastName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="นามสกุล"
              required
            />
          </div>
          <div>
            <label htmlFor="branch" className="sr-only">สาขา</label>
            <select
              id="branch"
              name="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">-- เลือกสาขา --</option>
              {branches.map((branchOption, index) => (
                <option key={index} value={branchOption}>
                  {branchOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="group" className="sr-only">คณะ</label>
            <input
              id="group"
              name="group"
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="คณะ"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">อีเมล</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="อีเมล"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="sr-only">หมายเลขโทรศัพท์</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="หมายเลขโทรศัพท์"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              อัปเดต
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAdvisor;
