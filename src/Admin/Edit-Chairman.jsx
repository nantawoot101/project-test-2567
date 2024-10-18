import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function EditChairman() {
  const { id_chairman } = useParams(); // เปลี่ยนจาก id_expert เป็น id_chairman
  const [chairmanTitle, setChairmanTitle] = useState('');
  const [chairmanName, setChairmanName] = useState('');
  const [chairmanLastName, setChairmanLastName] = useState('');
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

  // Fetch the current chairman data when the component loads
  useEffect(() => {
    const fetchChairman = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/chairman/getById/${id_chairman}`);
        
        // Check if response.data.chairman exists and has the necessary fields
        const chairmanData = response.data.chairman;

        if (chairmanData) {
          const { chairman_title, chairman_name, chairman_lastname, branch, group, phone_number, email } = chairmanData;
          setChairmanTitle(chairman_title);
          setChairmanName(chairman_name);
          setChairmanLastName(chairman_lastname);
          setBranch(branch);
          setGroup(group);
          setPhoneNumber(phone_number);
          setEmail(email);
        } else {
          throw new Error('Chairman data is not available');
        }
      } catch (error) {
        console.error('Error fetching chairman:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลประธานได้',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    };

    fetchChairman();
  }, [id_chairman]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:9999/chairman/update`, { 
        id_chairman, // ส่ง id_chairman ไปด้วย
        chairman_title: chairmanTitle,
        chairman_name: chairmanName,
        chairman_lastname: chairmanLastName,
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

      navigate('/chairman'); // Navigate back to the chairman list
    } catch (error) {
      console.error('Error updating chairman:', error);
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
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-4">อัปเดตข้อมูลประธาน</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          แก้ไขข้อมูลประธานในฟอร์มด้านล่าง
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="chairmanTitle" className="sr-only">ตำแหน่งประธาน</label>
            <input
              id="chairmanTitle"
              name="chairmanTitle"
              type="text"
              value={chairmanTitle}
              onChange={(e) => setChairmanTitle(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

export default EditChairman;
