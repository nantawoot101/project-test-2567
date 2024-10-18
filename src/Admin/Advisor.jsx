import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";

const Advisor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advisors, setAdvisors] = useState([]); // Changed from filteredUsers to experts
  const [filteredAdvisor, setFilteredAdvisor] = useState([]); // For search filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:9999/advisor/getAll");
        setAdvisors(userResponse.data);
        setFilteredAdvisor(userResponse.data); // Initialize filteredExperts
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลได้");
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลได้",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter experts based on search term
    const filtered = advisors.filter(advisor =>
    advisor.advisor_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.advisor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.advisor_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdvisor(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, advisors]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
    }
  };

  const handleDelete = async (id_advisor) => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "ข้อมูลนี้จะถูกลบและไม่สามารถกู้คืนได้!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ลบ!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:9999/advisor/delete/${id_advisor}`);
        Swal.fire("ลบเรียบร้อย!", "ข้อมูลของคุณถูกลบแล้ว", "success");
        // Re-fetch data after deletion
        const userResponse = await axios.get("http://localhost:9999/advisor/getAll");
        setAdvisors(userResponse.data);
        setFilteredAdvisor(userResponse.data);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
      });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = filteredAdvisor.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdvisor.length / itemsPerPage);

  if (loading) {
    return <p>กำลังโหลด...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-6 pl-72 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        ข้อมูลอาจารย์ที่ปรึกษา
      </h1>
  
      <div className="mb-4 flex justify-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            className="p-3 w-full rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10"
            placeholder="ค้นหาอาจารย์ที่ปรึกษา..."
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
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                ลำดับ
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                คำนำหน้า
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                ชื่อ
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                นามสกุล
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                เบอร์โทรศัพท์
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                อีเมล
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((advisor, index) => (
                <tr key={advisor.id_advisor} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {advisor.advisor_title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {advisor.advisor_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {advisor.advisor_lastname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {advisor.phone_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {advisor.email}
                  </td>
                  <td className="px-6 py-4 flex justify-center items-center space-x-2">
                    <Link
                      to={`/edit-advisor/${advisor.id_advisor}`}
                      className="px-3 py-1 bg-yellow-400 text-white rounded-lg shadow-md hover:bg-yellow-500 transition duration-200"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(advisor.id_advisor)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4 flex justify-end mt-5">
        <Link
          to={`/new-advisor`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          เพิ่มอาจารย์ที่ปรึกษา
        </Link>
      </div>
  
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
        >
          {"< ก่อนหน้า"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            className={`px-4 py-2 ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition duration-200`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
        >
          {"ถัดไป >"}
        </button>
      </div>
    </div>
  );
};

export default Advisor;
