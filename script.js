document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studyPlanForm");
  const outputContainer = document.getElementById("outputContainer");
  const flowchartContainer = document.getElementById("flowchartContainer");
  const previousPlansContainer = document.getElementById("previousPlansContainer");
  const showPreviousPlansBtn = document.getElementById("showPreviousPlansBtn");

  let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];

  function savePlans() {
    localStorage.setItem("studyPlans", JSON.stringify(plans));
  }

  function renderFlowchart(topics, subtopics) {
    flowchartContainer.innerHTML = "";
    topics.forEach(topic => {
      let topicNode = document.createElement("div");
      topicNode.className = "flow-node";
      topicNode.textContent = topic;
      flowchartContainer.appendChild(topicNode);

      subtopics.forEach(sub => {
        let subNode = document.createElement("div");
        subNode.className = "flow-node sub-node";
        subNode.textContent = sub;
        topicNode.appendChild(subNode);
      });
    });
  }

  function renderOutput(plan) {
    let daysLeft = Math.ceil((new Date(plan.examDate) - new Date()) / (1000*60*60*24));
    outputContainer.innerHTML = `
      <h2>${plan.examName}</h2>
      <p><strong>Exam Date:</strong> ${plan.examDate} (${daysLeft} days left)</p>
      <p><strong>Topics:</strong> ${plan.topics.join(", ")} (Time: ${plan.timePerTopic})</p>
      <p><strong>Subtopics:</strong> ${plan.subtopics.join(", ")} (Time: ${plan.timePerSubtopic})</p>
    `;
    renderFlowchart(plan.topics, plan.subtopics);
  }

  function renderPreviousPlans() {
    previousPlansContainer.innerHTML = "";
    plans.forEach((plan, index) => {
      let div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${plan.examName}</strong> - ${plan.examDate}</p>
        <button onclick="deletePlan(${index})">Delete</button>
      `;
      previousPlansContainer.appendChild(div);
    });
  }

  window.deletePlan = function(index) {
    plans.splice(index, 1);
    savePlans();
    renderPreviousPlans();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const plan = {
      examName: document.getElementById("examName").value,
      examDate: document.getElementById("examDate").value,
      topics: document.getElementById("studyTopics").value.split(",").map(t => t.trim()),
      subtopics: document.getElementById("subTopics").value.split(",").map(t => t.trim()),
      timePerTopic: document.getElementById("timePerTopic").value,
      timePerSubtopic: document.getElementById("timePerSubtopic").value
    };
    plans.push(plan);
    savePlans();
    renderOutput(plan);
    form.reset();
  });

  showPreviousPlansBtn.addEventListener("click", () => {
    renderPreviousPlans();
  });
});
