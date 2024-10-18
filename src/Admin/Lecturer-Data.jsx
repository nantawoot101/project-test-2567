import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const LecturerData = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await axios.get('http://localhost:9999/role/getAll');
        setRoles(roleResponse.data);

        const userResponse = await axios.get('http://localhost:9999/auth/getAll');
        setMembers(userResponse.data);

        const filtered = userResponse.data.filter(member => member.role_id === 2);
        setFilteredUsers(filtered);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลได้');
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลได้',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const filtered = members.filter((member) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          member.member_title.toLowerCase().includes(searchLower) ||
          member.member_name.toLowerCase().includes(searchLower) ||
          member.member_lastname.toLowerCase().includes(searchLower) ||
          member.Id_student.toLowerCase().includes(searchLower) ||
          member.faculity.toLowerCase().includes(searchLower) ||
          member.branch.toLowerCase().includes(searchLower) ||
          member.username_id.toLowerCase().includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  };

  const handleDelete = async (memberId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'ข้อมูลนี้จะถูกลบและไม่สามารถกู้คืนได้!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:9999/auth/delete/${memberId}`);
        Swal.fire(
          'ลบเรียบร้อย!',
          'ข้อมูลของคุณถูกลบแล้ว',
          'success'
        );

        setMembers(members.filter(member => member.member_id !== memberId));
        setFilteredUsers(filteredUsers.filter(member => member.member_id !== memberId));
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถลบข้อมูลได้',
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return <p>กำลังโหลด...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-6 pl-72 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">ข้อมูลอาจารย์</h1>
      <div className="mb-4 flex justify-center">
        <div className="relative w-1/2">
          <input
            type="text"
            className="p-3 w-full rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10"
            placeholder="ค้นหาอาจารย์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ลำดับ</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">คำนำหน้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ชื่อ</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">นามสกุล</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">คณะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">สาขา</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ชื่อผู้ใช้</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((member, index) => (
                <tr key={member.username_id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.member_title}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.member_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.member_lastname}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.faculity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.branch}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.username_id}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Link to={`/edit-user/${member.member_id}`} className="px-3 py-1 bg-yellow-400 text-white rounded-lg shadow-md hover:bg-yellow-500 transition duration-200">แก้ไข</Link>
                    <button 
                      onClick={() => handleDelete(member.member_id)} 
                      className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200">
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 text-white rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          ก่อนหน้า
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`px-4 py-2 mx-2 text-white rounded-lg ${currentPage === index + 1 ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 text-white rounded-lg ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default LecturerData;
