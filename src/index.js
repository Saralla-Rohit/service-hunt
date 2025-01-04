$(function(){
    function loadView(url) {
        $.ajax({
            method: "get",
            url: url,
            success: (resp) => {
                $("section").html(resp);
            }
        });
    }

    const userId = $.cookie("userid");
    if (userId) {
        loadView("../public/provider-dashboard.html");
        // GetRooms(userId);
    }else{
        loadView("../public/home.html")
    }
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
    $(document).on("click",".back",()=>{
        loadView("../public/index.html")
    })
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
    $(document).on("keyup", "#txtRUserId", (e) => {
        console.log("User Id Typed: ", e.target.value);
        $.ajax({
            method: "get",
            url: "http://localhost:5500/providers",
            success: (users) => {
                for (var user of users) {
                    if (user.UserId == e.target.value) {
                        $("#lblUserIdError")
                            .html("User Id already exist - try another")
                            .addClass("text-danger");
                        break;
                    } else {
                        $("#lblUserIdError")
                            .html("User Id available")
                            .removeClass("text-danger")
                            .addClass("text-success");
                    }
                }
            }
        });
    });
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
                        GetRooms(user.UserId);
                    } else {
                        alert("Invalid password");
                    }
                } else {
                    alert("Invalid Login Credentials");
                }
            }
        });
    });
    $(document).on("click", "#btnSignout", () => {
        $.removeCookie("username");
        $.removeCookie("userid");
        loadView("../public/login.html");
    });
    $(document).on("click","#btnCreateProfile",()=>{
        loadView("../public/create-profile.html")
    })
    

})
