// Global variable to store wildlife data
let wildlifeData = [];

// Fetch & display wildlife (initial load only)
function displayWildlife() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    dataType: "json",
    cache: false,
    success: function (data) {
      wildlifeData = data.slice(0, 20); // load first 20 items
      handleResponse(wildlifeData);
    },
    error: function (error) {
      console.error("Error fetching wildlife:", error);
    },
  });
}

// Render table rows
function handleResponse(data) {
  var wildlifeList = $("#wildlifeTableBody");
  wildlifeList.empty();

  $.each(data, function (index, wildlife) {
    wildlifeList.append(
      `<tr>
        <td>${wildlife.id}</td>
        <td>
          <span class="editable" onclick="editTitle(${wildlife.id})" id="title-${wildlife.id}">${wildlife.title}</span>
          <div class="inline-form" id="title-form-${wildlife.id}" style="display:none;">
            <input type="text" value="${wildlife.title}" 
              onblur="saveTitle(${wildlife.id})" 
              onkeypress="handleKeyPress(event, ${wildlife.id}, 'title')">
          </div>
        </td>
        <td>
          <span class="editable" onclick="editContent(${wildlife.id})" id="content-${wildlife.id}">${wildlife.body}</span>
          <div class="inline-form" id="content-form-${wildlife.id}" style="display:none;">
            <input type="text" value="${wildlife.body}" 
              onblur="saveContent(${wildlife.id})" 
              onkeypress="handleKeyPress(event, ${wildlife.id}, 'content')">
          </div>
        </td>
        <td>
          <button class="btn btn-warning btn-sm mr-2 btn-edit" data-id="${wildlife.id}">Edit</button>
          <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${wildlife.id}">Delete</button>
        </td>
      </tr>`
    );
  });
}

// Delete wildlife (local only + fake API call)
function deleteWildlife() {
  let wildlifeId = $(this).attr("data-id");

  // Update locally
  wildlifeData = wildlifeData.filter((item) => item.id != wildlifeId);
  handleResponse(wildlifeData);

  // Fake API request (not persisted)
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + wildlifeId,
    method: "DELETE",
    success: function () {
      console.log("Deleted (simulated on API)");
    },
  });
}

// Form submission (create or update)
function handleFormSubmission(event) {
  event.preventDefault();
  let wildlifeId = $("#createBtn").attr("data-id");
  var title = $("#title").val();
  var body = $("#content").val();

  if (wildlifeId) {
    // Update local
    const index = wildlifeData.findIndex((item) => item.id == wildlifeId);
    if (index !== -1) {
      wildlifeData[index].title = title;
      wildlifeData[index].body = body;
    }
    handleResponse(wildlifeData);
    clearForm();

    // Fake API update
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + wildlifeId,
      method: "PUT",
      data: JSON.stringify({ id: wildlifeId, title, body, userId: 1 }),
      contentType: "application/json",
      success: function () {
        console.log("Updated (simulated on API)");
      },
    });
  } else {
    // Create new locally
    const newId = wildlifeData.length
      ? Math.max(...wildlifeData.map((item) => item.id)) + 1
      : 101;
    const newItem = { id: newId, title, body, userId: 1 };
    wildlifeData.unshift(newItem);
    handleResponse(wildlifeData);
    clearForm();

    // Fake API create
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: JSON.stringify(newItem),
      contentType: "application/json",
      success: function () {
        console.log("Created (simulated on API)");
      },
    });
  }
}

// Edit button click
function editBtnClicked(event) {
  event.preventDefault();
  let wildlifeId = $(this).attr("data-id");
  const item = wildlifeData.find((w) => w.id == wildlifeId);
  if (item) {
    $("#clearBtn").show();
    $("#title").val(item.title);
    $("#content").val(item.body);
    $("#createBtn").html("Update");
    $("#createBtn").attr("data-id", item.id);
  }
}

// Clear form
function clearForm() {
  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#title").val("");
  $("#content").val("");
}

// Inline edit helpers
function editTitle(id) {
  $(`#title-${id}`).hide();
  $(`#title-form-${id}`).show().find("input").focus();
}

function editContent(id) {
  $(`#content-${id}`).hide();
  $(`#content-form-${id}`).show().find("input").focus();
}

function saveTitle(id) {
  const newTitle = $(`#title-form-${id} input`).val();
  const item = wildlifeData.find((w) => w.id == id);
  if (item) item.title = newTitle;

  $(`#title-${id}`).text(newTitle).show();
  $(`#title-form-${id}`).hide();

  $.ajax({
    url: `https://jsonplaceholder.typicode.com/posts/${id}`,
    method: "PUT",
    data: JSON.stringify({ id, title: newTitle, body: item?.body, userId: 1 }),
    contentType: "application/json",
    success: function () {
      console.log("Title updated (simulated)");
    },
  });
}

function saveContent(id) {
  const newContent = $(`#content-form-${id} input`).val();
  const item = wildlifeData.find((w) => w.id == id);
  if (item) item.body = newContent;

  $(`#content-${id}`).text(newContent).show();
  $(`#content-form-${id}`).hide();

  $.ajax({
    url: `https://jsonplaceholder.typicode.com/posts/${id}`,
    method: "PUT",
    data: JSON.stringify({ id, title: item?.title, body: newContent, userId: 1 }),
    contentType: "application/json",
    success: function () {
      console.log("Content updated (simulated)");
    },
  });
}

function handleKeyPress(event, id, type) {
  if (event.key === "Enter") {
    if (type === "title") saveTitle(id);
    if (type === "content") saveContent(id);
  } else if (event.key === "Escape") {
    $(`#${type}-${id}`).show();
    $(`#${type}-form-${id}`).hide();
  }
}

// Init
$(document).ready(function () {
  displayWildlife();
  $(document).on("click", ".btn-del", deleteWildlife);
  $(document).on("click", ".btn-edit", editBtnClicked);
  $("#wildlifeForm").submit(handleFormSubmission);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    clearForm();
  });
  $("#clearBtn").hide();
});
