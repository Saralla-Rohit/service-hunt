$(function () {
    // Function to load view dynamically into the page
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
    
    // Check if user is logged in
    if (userId) {
        loadView("../public/provider-dashboard.html", function() {
            // Fetch the profile data and render it immediately
            $.ajax({
                method: "get",
                url: `http://localhost:5500/get-profile/${userId}`, // Updated endpoint
                success: (profile) => {
                    if (profile && profile.UserName) {
                        // Render profile container with fetched data
                        $("#ProfileContainer").html(`
                            <div class="card shadow-sm border-0 mb-4">
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
                                </div>
                            </div>
                        `);
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
    $(document).on("click", "#btnServiceProvider", () => {
        loadView("../public/auth.html");
    });

    $(document).on("click", "#btnCreateAccount", () => {
        loadView("../public/register.html");
    });

    $(document).on("click", "#btnSignin", () => {
        loadView("../public/login.html");
    });

    $(document).on("click", "#btnCancel", () => {
        loadView("../public/auth.html");
    });

    $(document).on("click", ".back", () => {
        loadView("../public/index.html")
    });

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
    $(document).on("click", "#btnCreateProfile", () => {
        loadView("../public/create-profile.html")
    });

    $(document).on("click", "#btnCancelCreate", () => {
        loadView("../public/provider-dashboard.html")
    });

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
                    $("#ProfileContainer").html(`
                        <div class="card shadow-sm border-0 mb-4">
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
                            </div>
                        </div>
                    `);
                });
            }
        });
    });
});
