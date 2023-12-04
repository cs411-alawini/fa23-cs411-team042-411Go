import logo from "./logo.svg";
import axios from "axios";
import "./App.css";
import React, { useEffect, useState } from "react";
import photo from "./SafeWalkLA1.png";
import CrimeReportForm from "./CrimeReportForm";
import UpdateForm from "./UpdateForm";

var count = 1;
var countAge = 1;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

const api = axios.create();
function App() {
  const [areas, setAreas] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [rate, setRate] = useState([]);
  const [DR_NO, setDR_NO] = useState("");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openUpdateModal = (DR_NO) => {
    console.log(DR_NO);
    setDR_NO(DR_NO);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  useEffect(() => {
    api.get("http://127.0.0.1:5000/areacode", options).then((res) => {
      if (res.data) {
        console.log(res.data);
        setAreas(res.data.response);
      }
    });
  }, []);

  const handlerate = () => {
    api.get("http://127.0.0.1:5000/rate", options).then((res) => {
      if (res.data) {
        console.log(res.data);
        setRate(res.data.response);
      }
    });
  };

  return (
    <div>
      <div className="App">
        <img src={photo} alt="Image Description"></img>
      </div>
      <h1>☆SafeWalkLA☆</h1>
      <h2>-Top 5 Dangerous Places-</h2>
      <ul>
        {areas.map((todo) => (
          <BlockWithDetails
            key={todo.AreaCode}
            todo={todo}
            openUpdateModal={openUpdateModal}
          />
        ))}
      </ul>
      <button className="newcasebutton" onClick={openModal}>
        New Case
      </button>
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
      <ModalForUpdate
        isOpen={isUpdateModalOpen}
        closeModal={closeUpdateModal}
        DR_NO={DR_NO}
      />
      <div>
        <SearchBar />
      </div>
      <div>
        <ShowAvgAge />
      </div>
      <div>
        <button className="show" onClick={() => handlerate()}>
          Show Increase Rate
        </button>
      </div>
      <div>
        {rate.map((todo) => (
          <RateBlock key={todo.Month} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default App;

const BlockWithDetails = (props) => {
  // State to manage the visibility of details for each block
  const [showDetails, setShowDetails] = useState(false);

  // Function to toggle the visibility of details for each block
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div key={props.todo.AreaCode}>
      <div className="areablock">
        <span>{props.todo.AreaName}</span>
        <div className="crimeNum">
          Number of crime cases: {props.todo.crime_num}
        </div>
        <button className="togglebutton" onClick={toggleDetails}>
          show cases
        </button>
      </div>

      {showDetails && (
        <Dropdown
          openUpdateModal={props.openUpdateModal}
          AreaCode={props.todo.AreaCode}
        />
      )}
    </div>
  );
};

function Dropdown(props) {
  const [areas, setAreas] = useState([]);
  const [cases, setCases] = useState([]);
  const [deletedCases, setDeletedCases] = useState([]);
  // console.log(props.AreaCode);
  useEffect(() => {
    api
      .get("http://127.0.0.1:5000/cases/" + props.AreaCode, options)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setCases(res.data.response);
        }
      });
  }, []);

  const handleDelete = (DR_NO) => {
    console.log(DR_NO);
    api
      .post("http://127.0.0.1:5000/delete", { DR_NO: DR_NO }, options)
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        setDeletedCases([...deletedCases, DR_NO]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    window.location.reload();
  };

  const handleUpdate = (DR_NO) => {
    props.openUpdateModal(DR_NO);
  };

  return (
    <div className="dropdowncontainer">
      {cases.map((item) => (
        <div key={item.DR_NO}>
          <span>
            Date: {item.DateReported} Location: {item.Location} Description:{" "}
            {item.CrimeCodeDesc}
          </span>
          <button className="update" onClick={() => handleUpdate(item.DR_NO)}>
            Update
          </button>
          <button className="delete" onClick={() => handleDelete(item.DR_NO)}>
            Delete
          </button>
          {/* <button className="update" onClick={updateTodo(item.DR_NO, newText)}>Update</button>
        <button className="delete" onClick={deleteCases(item.DR_NO)}>Delete</button> */}
        </div>
      ))}
    </div>
  );
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState([""]);
  const [searchAreas, setSearchAreas] = useState([]);
  useEffect(() => {
    if (count === 1 || count === 2) {
      count++;
      return;
    }
    if (searchTerm === "") {
      return;
    }
    console.log(searchTerm);
    api
      .get("http://127.0.0.1:5000/search/" + searchTerm, options)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setSearchAreas(res.data.response);
        }
      });
  }, [searchTerm]);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search Location..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchTerm(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
      <ul>
        {searchAreas.map((todo) => (
          <BlockWithDetails key={todo.AreaCode} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

const Modal = ({ isOpen, closeModal }) => {
  const modalStyle = {
    display: isOpen ? "block" : "none",
    // add other styles as needed
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <p>Insert New Case</p>
        <CrimeReportForm />
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

const ModalForUpdate = ({ isOpen, closeModal, DR_NO }) => {
  const modalStyle = {
    display: isOpen ? "block" : "none",
    // add other styles as needed
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <p>Update this case</p>
        <UpdateForm DR_NO={DR_NO} />
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

function ShowAvgAge() {
  const [CrimeCode, setCrimeCode] = useState([]);
  const [avgAge, setAvgAge] = useState([]);
  const handlecalculate = () => {
    if (countAge === 1) {
      countAge++;
      return;
    }
    if (CrimeCode === "") {
      return;
    }
    api
      .get("http://127.0.0.1:5000/avgAge/" + CrimeCode, options)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setAvgAge(res.data.response);
        }
      });
  };

  return (
    <div>
      <div>
        <input
          type="number"
          placeholder="input CrimeCode..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setCrimeCode(e.target.value);
              handlecalculate();
              e.target.value = "";
            }
          }}
        />
      </div>
      <ul>
        {avgAge.map((todo) => (
          <AvgAgeBlock key={todo.CrimeCode} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

const AvgAgeBlock = (props) => {
  return (
    <div>
      <div>
        <span>CrimeCode: {props.todo.CrimeCode}, CrimeDesc: {props.todo.CrimeDesc}</span>
        <div className="avgAge">Average Age: {props.todo.avgAge}</div>
        <div className="avgAgeGroup">
          Average Age Group: {props.todo.ageGroup}
        </div>
      </div>
    </div>
  );
};

const RateBlock = (props) => {
  return (
    <div>
      <div>
        <span>Month: {props.todo.Month}</span>
        <span className="rate">   Increase Rate: {props.todo.rate}</span>
      </div>
    </div>
  );
};
