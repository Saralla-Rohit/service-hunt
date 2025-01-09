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
// Profile HTML template with added Location field
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
                <!-- Added Location field -->
                <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                        <div>
                            <small class="text-muted">Location</small>
                            <p class="mb-0 fw-bold">${profile.Location || "Not Provided"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-3">
                <button class="btn btn-warning" id="btnEdit" value="${profile.UserId}">Edit Profile</button>
            </div>
        </div>
    </div>`;

// Service card template
function generateServiceCard(provider) {
    return `
        <div class="col-lg-4 col-md-6 mb-3 ms-0.5">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${provider.UserName}</h5>
                    <p class="card-text"><i class="fas fa-tools me-2"></i>Service: ${provider.Service}</p>
                    <p class="card-text"><i class="fas fa-dollar-sign me-2"></i>Rate: ₹${provider.HourlyRate}/hr</p>
                    <p class="card-text"><i class="fas fa-briefcase me-2"></i>Experience: ${provider.YearsOfExperience} years</p>
                    <p class="card-text"><i class="fas fa-map-marker-alt me-2"></i>Location: ${provider.Location}</p>
                    <p class="card-text"><i class="fas fa-phone me-2"></i>Contact: ${provider.MobileNumber}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <button class="btn btn-info w-100" onclick="window.location.href='mailto:${provider.Email}'">
                        <i class="fas fa-envelope me-2"></i>View Info 
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to handle contacting provider
function contactProvider(email) {
    window.location.href = `mailto:${email}`;
}

// Check if user is logged in
if (userId) {
    loadView("../public/provider-dashboard.html", function () {
        // Fetch the profile data and render it immediately
        $.ajax({
            method: "get",
            url: `http://localhost:5500/get-profile/${userId}`,
            success: (profile) => {
                if (profile) {
                    $("#ProfileContainer").html(profileTemplate(profile));
                } else {
                    console.log("No profile found");
                    $("#ProfileContainer").html("<p>No profile found. Please create your profile.</p>");
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
$(document).on("click", "#back", () => loadView("../public/home.html"));

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
        Location: $("#cityTextbox").val(),
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
            $("#cityTextbox").val();
            $("#selServices").val("");

            loadView("../public/provider-dashboard.html", () => {
                $("#ProfileContainer").html(profileTemplate(profile));
            });
        }
    });
});

$(document).on("click", "#btnEdit", (e) => {
    e.preventDefault();
    const UserId = e.target.value || $.cookie("userid"); // Fallback to cookie if button value is empty
    if (!UserId) {
        console.error("No UserId found");
        alert("User ID not found. Please try logging in again.");
        return;
    }

    loadView("../public/edit-profile.html");

    $.ajax({
        method: "get",
        url: `http://localhost:5500/get-profile/${UserId}`,
        success: (profile) => {
            console.log("Profile fetched:", profile);
            if (profile) {
                // Fill the form with the profile data
                $("#txtEditName").val(profile.UserName);
                $("#txtEditEmail").val(profile.Email);
                $("#txtEditMobileNumber").val(profile.MobileNumber);
                $("#txtEditYearsOfExperience").val(profile.YearsOfExperience);
                $("#txtEditHourlyRate").val(profile.HourlyRate);
                $("#selServices").val(profile.Service);
                $("#editCityTextbox").val(profile.Location);
            } else {
                console.log("No profile found");
                alert("Profile not found");
            }
        },
        error: (err) => {
            console.error("Error fetching profile:", err);
            alert("Failed to load profile data.");
        }
    });
});

$(document).on("click", "#btnSave", () => {
    const UserId = $.cookie("userid");
    console.log("Save clicked, UserId from cookie:", UserId);

    if (!UserId) {
        console.error("No UserId found");
        alert("User ID not found. Please try logging in again.");
        return;
    }

    var profile = {
        UserName: $("#txtEditName").val(),
        Email: $("#txtEditEmail").val(),
        MobileNumber: $("#txtEditMobileNumber").val(),
        YearsOfExperience: $("#txtEditYearsOfExperience").val(),
        HourlyRate: $("#txtEditHourlyRate").val(),
        Service: $("#selServices").val(),
        Location: $("#editCityTextbox").val(),
        UserId: parseInt(UserId)
    };

    console.log("Sending profile data:", profile);

    $.ajax({
        method: "put",
        url: `http://localhost:5500/edit-profile/${UserId}`,
        data: JSON.stringify(profile),
        contentType: "application/json",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (response) => {
            console.log("Profile update response:", response);
            alert("Profile updated successfully!");
            loadView("../public/provider-dashboard.html", () => {
                // Refresh the profile data after update
                $.ajax({
                    method: "get",
                    url: `http://localhost:5500/get-profile/${UserId}`,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: (updatedProfile) => {
                        console.log("Updated profile:", updatedProfile);
                        $("#ProfileContainer").html(profileTemplate(updatedProfile));
                    },
                    error: (err) => {
                        console.error("Error fetching updated profile:", err);
                    }
                });
            });
        },
        error: (err) => {
            console.error("Error updating profile:", err);
            alert("Failed to update profile. Please try again.");
        }
    });
});

$(document).on("click", "#btnCancelEdit", () => {
    loadView("../public/provider-dashboard.html", () => {
        const userId = $.cookie("userid");
        if (userId) {
            $.ajax({
                method: "get",
                url: `http://localhost:5500/get-profile/${userId}`,
                success: (profile) => {
                    if (profile) {
                        $("#ProfileContainer").html(profileTemplate(profile));
                    } else {
                        console.log("No profile found");
                        $("#ProfileContainer").html("<p>No profile found. Please create your profile.</p>");
                    }
                },
                error: (err) => {
                    console.error("Error fetching profile:", err);
                }
            });
        }
    });
});

$(document).on("click", "#btnGuestUser", () => {
    loadView("../public/user-dashboard.html", () => {
        // Fetch service providers info with complete details
        $.ajax({
            url: "http://localhost:5500/providersInfo",
            method: "get",
            success: (providersInfo) => {
                console.log("Received providers info:", providersInfo);
                const servicesContainer = $("#servicesContainer");
                servicesContainer.empty();
                
                if (providersInfo.length === 0) {
                    servicesContainer.html('<div class="col-12 text-center"><p>No service providers available at the moment.</p></div>');
                    return;
                }
                
                // Generate and append cards for each provider
                providersInfo.forEach(provider => {
                    servicesContainer.append(generateServiceCard(provider));
                });
            },
            error: (err) => {
                console.error("Error fetching service providers:", err);
                $("#servicesContainer").html('<div class="col-12 text-center"><p class="text-danger">Error loading service providers. Please try again later.</p></div>');
            }
        });
    });
});

// Store the current filters
let currentFilters = {
    location: '',
    service: '',
    experience: 0,
    hourlyRate: 500
};

// Function to apply all filters
function applyFilters() {
    $.ajax({
        url: "http://localhost:5500/providersInfo",
        method: "get",
        success: function(providers) {
            let filteredProviders = providers;

            // Apply location filter
            if (currentFilters.location) {
                filteredProviders = filteredProviders.filter(provider => 
                    provider.Location === currentFilters.location
                );
            }

            // Apply service filter
            if (currentFilters.service) {
                filteredProviders = filteredProviders.filter(provider => 
                    provider.Service === currentFilters.service
                );
            }

            // Apply experience filter
            if (currentFilters.experience > 0) {
                filteredProviders = filteredProviders.filter(provider => 
                    provider.YearsOfExperience >= currentFilters.experience
                );
            }

            // Apply hourly rate filter
            if (currentFilters.hourlyRate > 500) {
                filteredProviders = filteredProviders.filter(provider => 
                    provider.HourlyRate <= currentFilters.hourlyRate
                );
            }

            // Update UI with filtered results
            $("#servicesContainer").empty();
            
            if (filteredProviders.length === 0) {
                $("#servicesContainer").append('<p>No service providers found matching all criteria.</p>');
            } else {
                filteredProviders.forEach(provider => {
                    $("#servicesContainer").append(generateServiceCard(provider));
                });
            }
        },
        error: function(err) {
            console.error("Error fetching providers:", err);
            $("#servicesContainer").html('<p class="text-danger">Error loading service providers. Please try again.</p>');
        }
    });
}

// Service filter handler
$(document).on("change", "#serviceSelect", function() {
    currentFilters.service = $(this).val();
    applyFilters();
});

// Years of Experience filter handler
$(document).on("change", "#yearsOfExperience", function() {
    currentFilters.experience = parseInt($(this).val()) || 0;
    $("#currentExperience").text(`Selected Range: ${currentFilters.experience}+ years`);
    applyFilters();
});

// Hourly Rate filter handler
$(document).on("change", "#hourlyRate", function() {
    currentFilters.hourlyRate = parseInt($(this).val()) || 500;
    $("#priceRangeText").text(`Price Range: ₹${currentFilters.hourlyRate}`);
    applyFilters();
});

// Location filter handler
$(document).on("click", "#filterByLocationBtn", () => {
    const locationValue = $('#locationInput').val();

    if (!locationValue) {
        alert("Please enter a location to filter by.");
        return;
    }

    currentFilters.location = locationValue;
    applyFilters();
});

// Reset filters
$(document).on("click", "#resetFilters", () => {
    currentFilters = {
        location: '',
        service: '',
        experience: 0,
        hourlyRate: 500
    };
    
    // Reset UI
    $("#serviceSelect").val('');
    $("#locationInput").val('');
    $("#yearsOfExperience").val('');
    $("#hourlyRate").val('500');
    $("#currentExperience").text('Selected Range: 0+ years');
    $("#priceRangeText").text('Price Range: ₹500');
    
    // Show all providers
    applyFilters();
});

$(document).ready(function () {
    $.ajax({
        method: "get",
        url: "http://localhost:5500/providers",
        success: (providers) => {
            console.log("Providers fetched:", providers);

            // Ensure the container is initially empty
            $("#servicesContainer").html('');

            if (providers && providers.length > 0) {
                providers.forEach((provider) => {
                    var cardBody = `
                        <div class="card shadow-sm border-0 mb-4" style="width: 18rem;">
                            <div class="card-header bg-primary text-white py-3">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-user-circle me-2"></i>${provider.UserName}
                                </h5>
                            </div>
                            <div class="card-body bg-light">
                                <p class="card-text">Email: ${provider.Email || "Not Provided"}</p>
                                <p class="card-text">Mobile: ${provider.Mobile || "Not Provided"}</p>
                                <p class="card-text">Location: ${provider.Location || "Not Provided"}</p>
                                <button class="btn btn-info">Contact</button>
                            </div>
                        </div>
                    `;
                    // Append each card to the services container
                    $("#servicesContainer").append(cardBody);
                });
            } else {
                $("#servicesContainer").html("<p>No providers found.</p>");
            }
        },
        error: (err) => {
            console.error("Error fetching providers:", err);
            $("#servicesContainer").html("<p>Failed to load providers.</p>");
        }
    });
});
