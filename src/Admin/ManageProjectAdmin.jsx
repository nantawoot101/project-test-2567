import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ManageProject() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(null);
  const { member_id } = useParams();
  const [experts, setExperts] = useState([]);
  const [chairmans, setChairmans] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    global_search: "",
    project_title: "",
    creator: "",
    id_student: "",
    advisor: "",
    development_type: "",
    school_year: "",
    chairman: "",
    expert: "",
  });
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get('http://localhost:9999/project/getAll');
        const creatorResponse = await axios.get('http://localhost:9999/creator/getAll');
        const expertResponse = await axios.get('http://localhost:9999/expert/getAll');
        const advisorResponse = await axios.get('http://localhost:9999/advisor/getAll');
        const chairmanResponse = await axios.get('http://localhost:9999/chairman/getAll');
        
        console.log('Expert Response:', expertResponse.data); // ตรวจสอบข้อมูลผู้ทรงคุณวุฒิ
        
        // Map creator data to projects
        const creatorsByProject = creatorResponse.data.reduce((acc, creator) => {
          if (!acc[creator.id_project]) {
            acc[creator.id_project] = { names: [], ids: [] };
          }
          acc[creator.id_project].names.push(creator.creator);
          acc[creator.id_project].ids.push(creator.id_student);
          return acc;
        }, {});
        
        // Map expert data to projects by id
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

        // Merge data from project, creator, and expert
        const mergedData = projectResponse.data.map((project) => {
          const projectCreators = creatorsByProject[project.id_project] || { names: [], ids: [] };
          const projectExpertName = expertsById[project.id_expert] || ''; // Get expert name
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
        setProjects(mergedData);
        setFilteredProjects(mergedData);
        setExperts(expertResponse.data); // ตั้งค่าผู้ทรงคุณวุฒิ
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [member_id]);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchCriteria(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const filterProjects = () => {
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
  };
  
  
  const handleSearchClick = () => {
    filterProjects();
  };

  const handleCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter((id) => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedProjects.map((id_project) =>
            axios.delete(`http://localhost:9999/project/delete/${id_project}`)
          )
        );
        setProjects(
          projects.filter(
            (project) => !selectedProjects.includes(project.id_project)
          )
        );
        setFilteredProjects(
          filteredProjects.filter(
            (project) => !selectedProjects.includes(project.id_project)
          )
        );
        setSelectedProjects([]);
        Swal.fire("ลบเรียบร้อย!", "ข้อมูลที่เลือกถูกลบออกแล้ว.", "success");
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลได้.", "error");
      }
    }
  };

  const handleEditClick = () => {
    if (selectedProjects.length !== 1) {
      Swal.fire(
        "ไม่สามารถดำเนินการได้!",
        "กรุณาเลือกเพียงโครงงานเดียวเพื่อทำการแก้ไข.",
        "warning"
      );
    } else {
      navigate(`/edit-project-data/${selectedProjects[0]}`);
    }
  };

  return (
    <div className="pl-72 p-4 bg-gray-100 min-h-screen">
      <main className="mt-8 container mx-auto">
        <div className="mt-4 mb-6 flex items-center">
          <input
            type="text"
            name="global_search"
            value={searchCriteria.global_search}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm"
            placeholder="ค้นหาข้อมูลทั้งหมด"
          />
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-r-md shadow-sm hover:bg-blue-600"
          >
            ค้นหา
          </button>
        </div>

        <div className="mt-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาตามหัวข้อโครงงาน
              </label>
              <input
                type="text"
                name="project_title"
                value={searchCriteria.project_title}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามหัวข้อโครงงาน"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาตามผู้แต่ง
              </label>
              <input
                type="text"
                name="creator"
                value={searchCriteria.creator}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามผู้แต่ง"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาตามรหัสนักศึกษา
              </label>
              <input
                type="text"
                name="id_student"
                value={searchCriteria.id_student}
                onChange={handleSearchChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="ค้นหาตามรหัสนักศึกษา"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาตามที่ปรึกษาโครงงาน
              </label>
              <select
                name="advisor"
                value={searchCriteria.advisor}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกอาจารย์ที่ปรึกษา</option>
              {advisors.map((advisor) => (
                <option key={advisor.id_advisor} value={advisor.id_advisor}>{advisor.advisor_title}{advisor.advisor_name} {advisor.advisor_lastname}</option>
              ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="development_type"
              >
                ประเภทการพัฒนา
              </label>
              <select
                name="development_type"
                value={searchCriteria.development_type}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกประเภทการพัฒนา</option>
                <option value="การพัฒนาเว็บ">การพัฒนาเว็บ</option>
                <option value="การพัฒนาแอปมือถือ">การพัฒนาแอปมือถือ</option>
                <option value="การพัฒนาซอฟต์แวร์">การพัฒนาซอฟต์แวร์</option>
                <option value="การวิเคราะห์ข้อมูล">การวิเคราะห์ข้อมูล</option>
                <option value="การพัฒนา AI">การพัฒนา AI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ค้นหาประธาน
              </label>
              <select
                name="chairman"
                value={searchCriteria.chairman}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
               <option value="">เลือกประธาน</option>
              {chairmans.map((chairman) => (
                <option key={chairman.id_chairman} value={chairman.id_chairman}>{chairman.chairman_title}{chairman.chairman_name} {chairman.chairman_lastname}</option>
              ))}
              </select>
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    ค้นหาผู้ทรงคุณวุฒิ
  </label>
  <select
    name="expert"
    value={searchCriteria.expert}
    onChange={handleSearchChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
  >
    <option value="">เลือกผู้ทรงคุณวุฒิ</option>
    {experts.length > 0 ? (
      experts.map(expert => (
        <option key={expert.id_expert} value={expert.id_expert}>
          {expert.expert_title}{expert.expert_name} {expert.expert_lastname}
        </option>
      ))
    ) : (
      <option value="">ไม่มีข้อมูล</option>
    )}
  </select>
</div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="school_year"
              >
                ปีที่จัดทำ
              </label>
              <select
                name="school_year"
                value={searchCriteria.school_year}
                onChange={handleSearchChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">เลือกปีที่จัดทำ</option>
                <option value="2566">2566</option>
                <option value="2567">2567</option>
              </select>
            </div>
          </div>
        </div>

        <table className="min-w-full mt-6 bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">เลือก</th>
              <th className="py-2 px-4 border-b">ลำดับ</th>
              <th className="py-2 px-4 border-b">หัวข้อโครงงาน</th>
              <th className="py-2 px-4 border-b">ผู้แต่ง</th>
              <th className="py-2 px-4 border-b">รหัสนักศึกษา</th>
              <th className="py-2 px-4 border-b">ที่ปรึกษาโครงงาน</th>
              <th className="py-2 px-4 border-b">ประธาน</th>
              <th className="py-2 px-4 border-b">ผู้ทรงคุณวุฒิ</th>
              <th className="py-2 px-4 border-b">ปีที่จัดทำ</th>
              <th className="py-2 px-4 border-b">ประเภทการพัฒนา</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.id_project}>
                  <td className="px-6 py-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id_project)}
                      onChange={() => handleCheckboxChange(project.id_project)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="px-6 py-4 border-b text-blue-600">
                    <Link to={`/project-admin/${project.id_project}`}>
                      {project.project_title}
                    </Link>
                  </td>
                  <td
                    className="px-6 py-4 border-b"
                    dangerouslySetInnerHTML={{ __html: project.creators }}
                  ></td>
                  <td
                    className="px-6 py-4 border-b"
                    dangerouslySetInnerHTML={{ __html: project.id_students }}
                  ></td>
                  <td className="px-6 py-4 border-b">{project.advisor}</td>
                  <td className="px-6 py-4 border-b">{project.chairman}</td>
                  <td className="px-6 py-4 border-b">{project.expert}</td>
                  <td className="px-6 py-4 border-b">{project.school_year}</td>
                  <td className="px-6 py-4 border-b">
                    {project.development_type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  ไม่มีข้อมูลที่ตรงตามเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <Link to="/new-project-admin">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 mr-2">
              เพิ่มโครงงาน
            </button>
          </Link>
    
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 mr-2"
          >
            ลบที่เลือก
          </button>
          <button
            onClick={handleEditClick}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-600"
          >
            แก้ไขที่เลือก
          </button>
        </div>
      </main>
    </div>
  );
}

export default ManageProject;
