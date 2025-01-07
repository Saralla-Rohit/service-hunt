function loadView(url, callback) {
    $.ajax({
        method: "get",
        url: url,
        success: (resp) => {
            $("section").html(resp);
            if (callback) callback();
        }
    });
}

// Get user ID from cookies to determine if logged in
const userId = $.cookie("userid");

// Profile HTML template
const profileTemplate = (profile) => 
    `<div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-primary text-white py-3">
            <h5 class="card-title mb-0">
                <i class="fas fa-user-circle me-2"></i>Profile Information
            </h5>
        </div>
        <div class="card-body bg-light">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-user text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Name</small>
                            <p class="mb-0 fw-bold">${profile.UserName}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-envelope text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Email</small>
                            <p class="mb-0 fw-bold">${profile.Email}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-phone text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Mobile</small>
                            <p class="mb-0 fw-bold">${profile.MobileNumber}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-briefcase text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Experience</small>
                            <p class="mb-0 fw-bold">${profile.YearsOfExperience} years</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-dollar-sign text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Hourly Rate</small>
                            <p class="mb-0 fw-bold">$${profile.HourlyRate}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-tools text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Service</small>
                            <p class="mb-0 fw-bold">${profile.Service}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-3">
                <button class="btn btn-warning" id="btnEdit" value="${userId}">Edit Profile</button>
            </div>
        </div>
    </div>`;

// Check if user is logged in
if (userId) {
    loadView("../public/provider-dashboard.html", function() {
        // Fetch the profile data and render it immediately
        $.ajax({
            method: "get",
            url: `http://localhost:5500/get-profile/${userId}`,
            success: (profile) => {
                if (profile && profile.UserName) {
                    $("#ProfileContainer").html(profileTemplate(profile));
                }
            },
            error: (err) => {
                console.error("Error fetching profile:", err);
            }
        });
    });
} else {
    loadView("../public/home.html");
}

// Navigation handlers
$(document).on("click", "#btnServiceProvider", () => loadView("../public/auth.html"));
$(document).on("click", "#btnCreateAccount", () => loadView("../public/register.html"));
$(document).on("click", "#btnSignin", () => loadView("../public/login.html"));
$(document).on("click", "#btnCancel", () => loadView("../public/auth.html"));
$(document).on("click", ".back", () => loadView("../public/index.html"));

// Register handler
$(document).on("click", "#btnRegister", () => {
    var user = {
        UserId: $("#txtRUserId").val(),
        UserName: $("#txtRUserName").val(),
        Password: $("#txtRPassword").val(),
        Email: $("#txtREmail").val(),
        Mobile: $("#txtRMobile").val()
    };

    $.ajax({
        method: "post",
        url: "http://localhost:5500/register-user",
        data: user,
        success: () => {
            alert("Registered Successfully..");
            loadView("../public/login.html");
        }
    });
});

// Login handler
$(document).on("click", "#btnLogin", () => {
    var userid = $("#txtLUserId").val();
    var password = $("#txtLPassword").val();

    $.ajax({
        method: "get",
        url: "http://localhost:5500/providers",
        success: (users) => {
            var user = users.find(rec => rec.UserId == userid);
            if (user) {
                if (user.Password == password) {
                    $.cookie("userid", user.UserId);
                    $.cookie("username", user.UserName);
                    loadView("../public/provider-dashboard.html");
                } else {
                    alert("Invalid password");
                }
            } else {
                alert("Invalid Login Credentials");
            }
        }
    });
});

// Signout handler
$(document).on("click", "#btnSignout", () => {
    $.removeCookie("username");
    $.removeCookie("userid");
    loadView("../public/login.html");
});

// Create Profile handler
$(document).on("click", "#btnCreateProfile", () => loadView("../public/create-profile.html"));
$(document).on("click", "#btnCancelCreate", () => loadView("../public/provider-dashboard.html"));

// Profile creation handler
$(document).on("click", "#createBtn", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    var profile = {
        UserName: $("#txtName").val(),
        Email: $("#txtEmail").val(),
        MobileNumber: $("#txtMobileNumber").val(),
        YearsOfExperience: $("#txtYearsOfExperience").val(),
        HourlyRate: $("#txtHourlyRate").val(),
        Service: $("#selServices").val(),
        UserId: $.cookie("userid")
    };

    $.ajax({
        method: "post",
        url: "http://localhost:5500/create-profile",
        data: profile,
        success: () => {
            alert("Created Profile Successfully");
            $("#txtName").val("");
            $("#txtEmail").val("");
            $("#txtMobileNumber").val("");
            $("#txtYearsOfExperience").val("");
            $("#txtHourlyRate").val("");
            $("#selServices").val("");
            
            loadView("../public/provider-dashboard.html", () => {
                $("#ProfileContainer").html(profileTemplate(profile));
            });
        }
    });
});

$(document).on("click", "#btnEdit", (e) => {
    const UserId = e.target.value;
    loadView("../public/edit-profile.html");

    $.ajax({
        method: "get",
        url: `http://localhost:5500/get-profile/${UserId}`,  // Ensure the userId is part of the URL
        success: (profile) => {
            console.log("Profile fetched:", profile);
            // Fill the form with the profile data
            $("#txtEditName").val(profile.UserName);
            $("#txtEditEmail").val(profile.Email);
            $("#txtEditMobileNumber").val(profile.MobileNumber);
            $("#txtEditYearsOfExperience").val(profile.YearsOfExperience);
            $("#txtEditHourlyRate").val(profile.HourlyRate);
            $("#selServices").val(profile.Service);
        },
        error: (err) => {
            console.error("Error fetching profile:", err);
            alert("Failed to load profile data.");
        }
    });
});

$(document).on("click", "#btnSave", () => {
    var profile = {
        UserName: $("#txtName").val(),
        Email: $("#txtEmail").val(),
        MobileNumber: $("#txtMobileNumber").val(),
        YearsOfExperience: $("#txtYearsOfExperience").val(),
        HourlyRate: $("#txtHourlyRate").val(),
        Service: $("#selServices").val(),
        UserId: $.cookie("userid")
    };

    $.ajax({
        method: "put",
        url: `http://localhost:5500/edit-profile/${profile.UserId}`,
        data: profile,
        success: () => {
            alert("Profile updated");
            loadView("../public/provider-dashboard.html");
        }
    });
});

$(document).on("click", "#btnCancelEdit", () => {
    loadView("../public/provider-dashboard.html");
});
