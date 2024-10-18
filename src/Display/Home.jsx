import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GraphReport from "./Graph-Report";

function Home() {
  const [projects, setProjects] = useState([]);
  const [creators, setCreators] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState(null);
  const [experts, setExperts] = useState([]);
  const [chairmans, setChairmans] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    project_title: "",
    creator: "",
    id_student: "",
    advisor: "",
    development_type: "",
    global_search: "",
    school_year: "", // เพิ่มปีการศึกษาในสถานะ
    chairman: "",
    expert: "",
  });

  const [searchHistory, setSearchHistory] = useState([]); // เพิ่ม state สำหรับเก็บประวัติการค้นหา
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.member_id) {
        setMemberId(user.member_id.toString());
      }
    }

    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(
          "http://localhost:9999/project/getAll"
        );
        const creatorResponse = await axios.get(
          "http://localhost:9999/creator/getAll"
        );

        const expertResponse = await axios.get(
          "http://localhost:9999/expert/getAll"
        );

        const advisorResponse = await axios.get('http://localhost:9999/advisor/getAll');
        const chairmanResponse = await axios.get('http://localhost:9999/chairman/getAll');

        const expertsById = expertResponse.data.reduce((acc, expert) => {
          // Combine expert_title, expert_name, and expert_lastname into a single string
          const combinedInfo = `${expert.expert_title}${expert.expert_name} ${expert.expert_lastname}`;
          
          // Map expert ID to the combined string
          acc[expert.id_expert] = combinedInfo;
          
          return acc;
        }, {});

        const chairmanById = chairmanResponse.data.reduce((acc, chairman) => {
          // Combine expert_title, expert_name, and expert_lastname into a single string
          const combinedInfo = `${chairman.chairman_title}${chairman.chairman_name} ${chairman.chairman_lastname}`;
          
          // Map expert ID to the combined string
          acc[chairman.id_chairman] = combinedInfo;
          
          return acc;
        }, {});
        
        const advisorById = advisorResponse.data.reduce((acc, advisor) => {
          // Combine expert_title, expert_name, and expert_lastname into a single string
          const combinedInfo = `${advisor.advisor_title}${advisor.advisor_name} ${advisor.advisor_lastname}`;
          
          // Map expert ID to the combined string
          acc[advisor.id_advisor] = combinedInfo;
          
          return acc;
        }, {});


        const creatorsByProject = creatorResponse.data.reduce(
          (acc, creator) => {
            if (!acc[creator.id_project]) {
              acc[creator.id_project] = {
                names: [],
                ids: [],
              };
            }
            acc[creator.id_project].names.push(creator.creator);
            acc[creator.id_project].ids.push(creator.id_student);
            return acc;
          },
          {}
        );

        const mergedData = projectResponse.data.map((project) => {
          const projectCreators = creatorsByProject[project.id_project] || {
            names: [],
            ids: [],
          };
          const projectExpertName = expertsById[project.id_expert] || ""; // Get expert name

          const projectChairmanName = chairmanById[project.id_chairman] || ''; 
          const projectAdvisorName = advisorById[project.id_advisor] || ''; 
  
          return {
            ...project,
            creators: projectCreators.names.join("<br />"),
            id_students: projectCreators.ids.join("<br />"),
            expert: projectExpertName,
            advisor: projectAdvisorName, // Single expert name
            chairman: projectChairmanName
          };
        });

        setAdvisors(advisorResponse.data);
        setChairmans(chairmanResponse.data);
        setExperts(expertResponse.data);
        setProjects(mergedData);
        setFilteredProjects(mergedData);
        setCreators(creatorResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = async (id_project) => {
    try {
      // ส่งข้อมูลไปยัง backend เพื่อบันทึกยอดวิว
      await axios.post("http://localhost:9999/view/save", {
        id_project: id_project,
        clickCount: 1,
        lastClicked: new Date(),
      });
    } catch (error) {
      console.error("Error adding view:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // เรียกใช้งาน handleSearch เมื่อกด Enter
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    });
  };

  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      // Find the expert name by ID
      const expert = experts.find(e => e.id_expert === project.id_expert);
      const expertName = expert ? `${expert.expert_title} ${expert.expert_name} ${expert.expert_lastname}`.toLowerCase() : '';
      const advisor = advisors.find(advisor => advisor.id_advisor === project.id_advisor);
      const advisorName = advisor ? `${advisor.advisor_title} ${advisor.advisor_name} ${advisor.advisor_lastname}`.toLowerCase() : '';
      const chairman = chairmans.find(chairman => chairman.id_chairman === project.id_chairman);
      const chairmanName = chairman ? `${chairman.chairman_title} ${chairman.chairman_name} ${chairman.chairman_lastname}`.toLowerCase() : '';
      // Check if the project matches the search criteria
      return (
        (searchCriteria.global_search === "" ||
          project.project_title.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.creators.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.id_students.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.advisor.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.development_type.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.school_year.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          project.chairman.toLowerCase().includes(searchCriteria.global_search.toLowerCase()) ||
          advisorName.includes(searchCriteria.global_search.toLowerCase()) ||
          chairmanName.includes(searchCriteria.global_search.toLowerCase()) ||
          expertName.includes(searchCriteria.global_search.toLowerCase())) &&
        (searchCriteria.project_title === "" || project.project_title.toLowerCase().includes(searchCriteria.project_title.toLowerCase())) &&
        (searchCriteria.creator === "" || project.creators.toLowerCase().includes(searchCriteria.creator.toLowerCase())) &&
        (searchCriteria.id_student === "" || project.id_students.toLowerCase().includes(searchCriteria.id_student.toLowerCase())) &&
        (searchCriteria.advisor === "" || project.id_advisor === parseInt(searchCriteria.advisor)) &&
        (searchCriteria.development_type === "" || project.development_type.toLowerCase().includes(searchCriteria.development_type.toLowerCase())) &&
        (searchCriteria.school_year === "" || project.school_year.toLowerCase().includes(searchCriteria.school_year.toLowerCase())) &&
        (searchCriteria.chairman === "" || project.id_chairman === parseInt(searchCriteria.chairman)) &&
        (searchCriteria.expert === "" || project.id_expert === parseInt(searchCriteria.expert))
      );
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);

    // เก็บประวัติการค้นหา
    setSearchHistory((prevHistory) =>
      [searchCriteria.global_search, ...prevHistory].slice(0, 5)
    );
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <main className="mt-8 container mx-auto">
        <div className="mb-8 flex items-center">
          <input
            type="text"
            name="global_search"
            value={searchCriteria.global_search}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md shadow-md transition-transform transform hover:scale-105 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="ค้นหาข้อมูลทั้งหมด"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-3 px-6 rounded-r-md shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ค้นหา
          </button>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาตามหัวข้อโครงงาน
              </label>
              <input
                type="text"
                name="project_title"
                value={searchCriteria.project_title}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ค้นหาตามหัวข้อโครงงาน"
              />
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาตามผู้แต่ง
              </label>
              <input
                type="text"
                name="creator"
                value={searchCriteria.creator}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ค้นหาตามผู้แต่ง"
              />
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาตามรหัสนักศึกษา
              </label>
              <input
                type="text"
                name="id_student"
                value={searchCriteria.id_student}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ค้นหาตามรหัสนักศึกษา"
              />
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาตามที่ปรึกษาโครงงาน
              </label>
              <select
                name="advisor"
                value={searchCriteria.advisor}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกอาจารย์ที่ปรึกษา</option>
              {advisors.map((advisor) => (
                <option key={advisor.id_advisor} value={advisor.id_advisor}>{advisor.advisor_title}{advisor.advisor_name} {advisor.advisor_lastname}</option>
              ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาประธาน
              </label>
              <select
                name="chairman"
                value={searchCriteria.chairman}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                 <option value="">เลือกประธาน</option>
              {chairmans.map((chairman) => (
                <option key={chairman.id_chairman} value={chairman.id_chairman}>{chairman.chairman_title}{chairman.chairman_name} {chairman.chairman_lastname}</option>
              ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาผู้ทรงคุณวุฒิ
              </label>
              <select
                name="expert"
                value={searchCriteria.expert}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกผู้ทรงคุณวุฒิ</option>
                {experts.length > 0 ? (
                  experts.map((expert) => (
                    <option key={expert.id_expert} value={expert.id_expert}>
                      {expert.expert_title}{expert.expert_name} {expert.expert_lastname}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูล</option>
                )}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ค้นหาปีที่จัดทำ
              </label>
              <select
                name="school_year"
                value={searchCriteria.school_year}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกปีที่จัดทำ</option>
                <option value="2566">2566</option>
                <option value="2567">2567</option>
                <option value="2568">2568</option>
              </select>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ประเภทการพัฒนา
              </label>
              <select
                name="development_type"
                value={searchCriteria.development_type}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm transition-transform transform hover:scale-105 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกประเภทการพัฒนา</option>
                <option value="การพัฒนาเว็บ">การพัฒนาเว็บ</option>
                <option value="การพัฒนาแอปมือถือ">การพัฒนาแอปมือถือ</option>
                <option value="การพัฒนาซอฟต์แวร์">การพัฒนาซอฟต์แวร์</option>
                <option value="การวิเคราะห์ข้อมูล">การวิเคราะห์ข้อมูล</option>
                <option value="การพัฒนา AI">การพัฒนา AI</option>
              </select>
            </div>
          </div>
        </div>

        <table className="min-w-full mt-6 bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border-b text-center text-lg">
                หัวข้อโครงงาน
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">
                ผู้แต่ง
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">
                รหัสนักศึกษา
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">
                ที่ปรึกษาโครงงาน
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">ประธาน</th>
              <th className="py-3 px-4 border-b text-center text-lg">
                ผู้ทรงคุณวุฒิ
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">
                ปีที่จัดทำ
              </th>
              <th className="py-3 px-4 border-b text-center text-lg">
                ประเภทการพัฒนา
              </th>
              {/* เพิ่มปีการศึกษา */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProjects.length > 0 ? (
              currentProjects.map((project, index) => (
                <tr
                  key={project.id_project}
                  className="transition-transform transform hover:scale-105"
                >
                  <td className="px-6 py-4 border-b text-center text-blue-600">
                    <Link
                      to={`/project/${project.id_project}`}
                      onClick={() => handleClick(project.id_project)}
                    >
                      {project.project_title}
                    </Link>
                  </td>
                  <td
                    className="px-6 py-4 border-b text-center"
                    dangerouslySetInnerHTML={{ __html: project.creators }}
                  ></td>
                  <td
                    className="px-6 py-4 border-b text-center"
                    dangerouslySetInnerHTML={{ __html: project.id_students }}
                  ></td>
                  <td className="px-6 py-4 border-b text-center">
                    {project.advisor}
                  </td>
                  <td className="px-6 py-4 border-b">{project.chairman}</td>
                  <td className="px-6 py-4 border-b">{project.expert}</td>
                  <td className="px-6 py-4 border-b text-center">
                    {project.school_year}
                  </td>{" "}
                  {/* แสดงปีการศึกษา */}
                  <td className="px-6 py-4 border-b text-center">
                    {project.development_type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  ไม่มีข้อมูลที่ตรงตามเงื่อนไข
                </td>{" "}
                {/* ปรับคอลัมน์ให้ตรงกับตารางใหม่ */}
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
          >
            ← ก่อนหน้า
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`py-2 px-4 rounded-md ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-blue-600`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
          >
            ถัดไป →
          </button>
        </div>
        <div>
          <GraphReport />
        </div>
      </main>
    </div>
  );
}

export default Home;
