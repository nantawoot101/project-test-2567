import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function NewChairman() {
  const [chairmanTitle, setChairmanTitle] = useState('');
  const [chairmanName, setChairmanName] = useState('');
  const [chairmanLastName, setChairmanLastName] = useState('');
  const [branch, setBranch] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newChairman = {
      chairman_title: chairmanTitle,
      chairman_name: chairmanName,
      chairman_lastname: chairmanLastName,
      branch,
      group: 'เทคโนโลยีสารสนเทศ', // Fixed value for the group
      phone_number: phoneNumber,
      email: email
    };

    try {
      const response = await axios.post('http://localhost:9999/chairman/save', newChairman);
      // Display success message using SweetAlert2
      Swal.fire({
        title: 'สำเร็จ',
        text: response.data.msg,
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      // Clear the form after saving
      setEmail('');
      setChairmanTitle('');
      setChairmanName('');
      setChairmanLastName('');
      setBranch('');
      setPhoneNumber('');
      navigate('/chairman');
    } catch (error) {
      console.error('Error saving chairman:', error);
      // Display error message using SweetAlert2
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pl-72">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-4">เพิ่มข้อมูลประธาน</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          แก้ไขข้อมูลประธานในฟอร์มด้านล่าง
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="chairmanTitle" className="sr-only">ตำแหน่งประธาน</label>
            <input
              id="chairmanTitle"
              name="chairmanTitle"
              type="text"
              value={chairmanTitle}
              onChange={(e) => setChairmanTitle(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
              placeholder="ตำแหน่งประธาน"
              required
            />
          </div>
          <div>
            <label htmlFor="chairmanName" className="sr-only">ชื่อ</label>
            <input
              id="chairmanName"
              name="chairmanName"
              type="text"
              value={chairmanName}
              onChange={(e) => setChairmanName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
              placeholder="ชื่อ"
              required
            />
          </div>
          <div>
            <label htmlFor="chairmanLastName" className="sr-only">นามสกุล</label>
            <input
              id="chairmanLastName"
              name="chairmanLastName"
              type="text"
              value={chairmanLastName}
              onChange={(e) => setChairmanLastName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
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
              value="เทคโนโลยีสารสนเทศ" // Fixed value for the group
              readOnly
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-100 focus:outline-none sm:text-sm mb-4"
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
              placeholder="หมายเลขโทรศัพท์"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewChairman;
