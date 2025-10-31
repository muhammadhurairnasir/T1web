// Fetch & display wildlife (initial load only)
function displayWildlife() {
  $("#loadingIndicator").show();
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    dataType: "json",
    cache: false,
    success: function (data) {
      const wildlifeData = data.slice(0, 20); // load first 20 items
      handleResponse(wildlifeData);
      $("#loadingIndicator").hide();
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

// Delete wildlife (via API only)
function deleteWildlife() {
  let wildlifeId = $(this).attr("data-id");

  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + wildlifeId,
    method: "DELETE",
    success: function () {
      console.log("Deleted (simulated on API)");
      displayWildlife(); // Refresh list after delete
    },
    error: function (error) {
      console.error("Error deleting wildlife:", error);
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
    // Update existing item
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + wildlifeId,
      method: "PUT",
      data: JSON.stringify({ id: wildlifeId, title, body, userId: 1 }),
      contentType: "application/json",
      success: function () {
        console.log("Updated (simulated on API)");
        displayWildlife();
        clearForm();
      },
      error: function (error) {
        console.error("Error updating:", error);
      },
    });
  } else {
    // Create new item
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: JSON.stringify({ title, body, userId: 1 }),
      contentType: "application/json",
      success: function () {
        console.log("Created (simulated on API)");
        displayWildlife();
        clearForm();
      },
      error: function (error) {
        console.error("Error creating:", error);
      },
    });
  }
}

// Edit button click
function editBtnClicked(event) {
  event.preventDefault();
  let wildlifeId = $(this).attr("data-id");

  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + wildlifeId,
    method: "GET",
    dataType: "json",
    success: function (data) {
      $("#clearBtn").show();
      $("#title").val(data.title);
      $("#content").val(data.body);
      $("#createBtn").html("Update");
      $("#createBtn").attr("data-id", data.id);
    },
    error: function (error) {
      console.error("Error loading data:", error);
    },
  });
}

// Clear form
function clearForm() {
  $("#clearBtn").hide();
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#title").val("");
  $("#content").val("");
}

// Initialize everything
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
