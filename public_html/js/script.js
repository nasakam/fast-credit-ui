//$(document).contextmenu(function(){
//    return false;
//});

$(document).ready(function () {
    var channelCode = "WEB_01";
    var EMPTY_STRING = "";
    var size = 3;
    var nextPage;
    var currentPage;
    var previousPage;

    $(this).contextmenu(function () {
        return false;
    });

    $(window).click(function (event) {
        if ($(event.target).is($("#loginModal")) && $("#loginModal").is(":visible")) {
            resetLoginForm();
        }

        if ($(event.target).is($("#add_new")) && $("#add_new").is(":visible")) {
            $("#add_new").removeClass("show").addClass("hide");
            resetNewCustomerForm();
        }

        if ($(event.target).is($("#view_all")) && $("#view_all").is(":visible")) {
            $("#view_all").removeClass("show").addClass("hide");
//            resetNewCustomerForm();
        }

        if ($(event.target).is($("#view_one")) && $("#view_one").is(":visible")) {
            $("#view_one").removeClass("show").addClass("hide");
            resetrow2();
        }
    });

    function resetrow2() {

    }

    function validateInput(val) {
        var retVal = false;
        if (val !== null && !val.match(/^ *$/)) {
            retVal = true;
        }

        return retVal;
    }

    function resetLoginForm() {
        $("#loginModal").removeClass("show").addClass("hide");
        $("#info").text("").removeClass("error");
        $("#info").removeClass("show").addClass("hide");

        $("#username").val(EMPTY_STRING);
        $("#password").val(EMPTY_STRING);
    }

    function resetNewCustomerForm() {
        $("#add_new").removeClass("show").addClass("hide");
        $("#info1").text("").removeClass("error");
        $("#info1").removeClass("show").addClass("hide");

        $("#firstname").val(EMPTY_STRING);
        $("#lastname").val(EMPTY_STRING);
        $("#email").val(EMPTY_STRING);
        $("#phonenumber").val(EMPTY_STRING);
        $("#dob").val(EMPTY_STRING);
        $("#password").val(EMPTY_STRING);
    }

    function resetNewCustomerForm2() {
        $("#loader_dx1").removeClass("show").addClass("hide");
        $("#info1").removeClass("hide").addClass("show");
        $("#info1").text("User saved successfully").removeClass("error").addClass("success");

        $("#firstname").val(EMPTY_STRING);
        $("#lastname").val(EMPTY_STRING);
        $("#email").val(EMPTY_STRING);
        $("#phonenumber").val(EMPTY_STRING);
        $("#dob").val(EMPTY_STRING);
        $("#password").val(EMPTY_STRING);
    }

    function disableBack() {
        window.history.forward();
    }

    $("#login").click(function () {
        $("#loginModal").removeClass("hide").addClass("show");
    });

    $("#loginSubmit").click(function (event) {
        event.preventDefault();
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();

        if (validateInput($("#username").val())) {
            if (validateInput($("#password").val())) {
                $("#loader_dx").removeClass("hide").addClass("show");

                $("#info").text("").removeClass("error");
                $("#info").removeClass("show").addClass("hide");

                var headerData = {
                    'ChannelCode': channelCode
                };
                var loginURL = "http://localhost:9797/fast-credit/api/v1/login";
                var loginDTO = {
                    "username": username,
                    "password": password
                };

                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: loginURL,
                    headers: headerData,
                    data: JSON.stringify(loginDTO),
                    processData: false,
                    timeout: 600000,
                    success: function (data) {
                        var response = data.data;
                        $("#loader_dx").removeClass("show").addClass("hide");

                        if (data) {
                            if (data.code === "00") {
                                $("#loginModal").removeClass("show").addClass("hide");
                                localStorage.setItem('token', data.data.access_token);
                                resetLoginForm();

                                if (response.role === "ADMIN") {
                                    window.location.href = "/user-interface/admin.html";
                                } else {
                                    window.location.href = "/user-interface/user.html";
                                }
                            } else {
                                $("#info").text(response).addClass("error");
                                $("#info").removeClass("hide").addClass("show");
                            }
                        } else {
                            $("#info").text("Error logging in").addClass("error");
                            $("#info").removeClass("hide").addClass("show");
                        }
                    },
                    error: function () {
                        $("#info").text("Error logging in").addClass("error");
                        $("#info").removeClass("hide").addClass("show");
                        $("#loader_dx").removeClass("show").addClass("hide");
                    }
                });
            } else {
                alert("Password must not be empty");
            }
        } else {
            alert("Username must not be empty");
        }
    });

    $("#addnew").click(function () {
        $("#add_new").removeClass("hide").addClass("show");
    });

    function clearInfo1() {
        $('input').focus(function () {
            $("#info").text("").removeClass("error");
            $("#info").removeClass("show").addClass("hide");

            $("#info1").text("").removeClass("error");
            $("#info1").removeClass("show").addClass("hide");
        });
    }
    clearInfo1();

    $("#form_").submit(function (event) {
        event.preventDefault();
        var firstname = $("#firstname").val().trim();
        var lastname = $("#lastname").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        var phonenumber = $("#phonenumber").val().trim();
        var dob = $("#dob").val();
        var nationality = $("#nationality").val();
        var gender = $('[name="gender"]:checked').val();
        var role = $("#role").val();

        if (validateInput(firstname) && validateInput(lastname) && validateInput(email) &&
                validateInput(phonenumber) && validateInput(password)) {
            $("#loader_dx1").removeClass("hide").addClass("show");

            $("#info1").text("").removeClass("error");
            $("#info1").removeClass("show").addClass("hide");

            var headerData = {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'ChannelCode': channelCode
            };
            var addUserURL = "http://localhost:9797/fast-credit/admin/v1/save-new";
            var newUserDTO = {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "phoneNumber": phonenumber,
                "dob": dob,
                "nationality": nationality,
                "gender": gender,
                "role": role,
                "password": password
            };

            $.ajax({
                type: 'POST',
                url: addUserURL,
                contentType: 'application/json',
                headers: headerData,
                data: JSON.stringify(newUserDTO),
                processData: false,
                timeout: 600000,
                success: function (data) {
                    var response = data.data;
                    $("#loader_dx1").removeClass("show").addClass("hide");

                    if (data) {
                        if (data.code === "00") {
                            $("#loginModal").removeClass("show").addClass("hide");

                            resetNewCustomerForm2();
                        } else {
                            $("#info1").text(response).removeClass("success").addClass("error");
                            $("#info1").removeClass("hide").addClass("show");
                        }
                    } else {
                        $("#info1").text("Error saving new user").removeClass("success").addClass("error");
                        $("#info1").removeClass("hide").addClass("show");
                    }
                },
                error: function () {
                    $("#info1").text("Error saving new user").removeClass("success").addClass("error");
                    $("#info1").removeClass("hide").addClass("show");
                    $("#loader_dx1").removeClass("show").addClass("hide");
                }
            });
        } else {
            alert("All fields are required");
        }
    });

    $("#viewall").click(function () {
        currentPage = 0;

        $("#view_all").removeClass("hide").addClass("show");
        $("#loader_dx2").removeClass("hide").addClass("show");
        $("#info2").text("").removeClass("error");
        $("#info2").removeClass("show").addClass("hide");

        $("#prev").removeClass("show2").addClass("hide");

//        if (init === 1) {
//            $("#prev").removeClass("show2").addClass("hide");
//        } else {
//            $("#prev").removeClass("hide").addClass("show2");
//        }

        var headerData = {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'ChannelCode': channelCode
        };
        var fetchUsers = "http://localhost:9797/fast-credit/admin/v1/users";
        var pagingDTO = {
            "init": currentPage,
            "size": size
        };

        $.ajax({
            type: 'POST',
            url: fetchUsers,
            contentType: 'application/json',
            headers: headerData,
            data: JSON.stringify(pagingDTO),
            processData: false,
            timeout: 600000,
            success: function (data) {
                var response = data.data;
                $("#loader_dx2").removeClass("show").addClass("hide");

                if (data) {
                    if (data.code === "00") {
                        nextPage = 1;
                        previousPage = 0;

                        $("#table_data").removeClass("hide").addClass("show");
                        var rows = "";

                        $.each(response, function (key, user) {
                            rows += "<tr class='pointer'>\n\
                                <td>" + user.firstname + "</td>\n\
                                <td>" + user.lastname + "</td>\n\
                                <td>" + user.email + "</td>\n\
                                <td>" + user.phonenumber + "</td>\n\
                                <td>" + user.dateOfBirth + "</td>\n\
                                <td>" + user.nationality + "</td>\n\
                                <td>" + user.gender + "</td>\n\
                                <td>" + user.createdOn + "</td>\n\
                                <td>" + user.role + "</td>\n\
                                </tr>";
                        });

                        $("#table_body").html(rows);
                    } else {
                        $("#info2").text(response).removeClass("success").addClass("error");
                        $("#info2").removeClass("hide").addClass("show");
                    }
                } else {
                    $("#info2").text("Error fetching users").removeClass("success").addClass("error");
                    $("#info2").removeClass("hide").addClass("show");
                }
            },
            error: function () {
                $("#info2").text("Error fetching users").removeClass("success").addClass("error");
                $("#info2").removeClass("hide").addClass("show");
                $("#loader_dx2").removeClass("show").addClass("hide");
            }
        });
    });

    $("#next").click(function () {
        prev_next("next");
    });

    $("#prev").click(function () {
        prev_next("prev");
    });

    function prev_next(which) {
        $("#view_all").removeClass("show").addClass("hide");

//        if (which === "next") {
//            currentPage = nextPage;
//            previousPage = currentPage === 0 ? currentPage : currentPage - 1;
//            nextPage = nextPage + 1;
//        } else {
//            currentPage = nextPage - 1;
//            previousPage = currentPage === 0 ? currentPage : currentPage + 1;
//            nextPage = currentPage - 1;
//        }

        $("#view_all").removeClass("hide").addClass("show");
        $("#loader_dx2").removeClass("hide").addClass("show");
        $("#info2").text("").removeClass("error");
        $("#info2").removeClass("show").addClass("hide");

        var headerData = {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'ChannelCode': channelCode
        };
        var fetchUsers = "http://localhost:9797/fast-credit/admin/v1/users";

        var pagingDTO = {
            "init": nextPage,
            "size": size
        };

        $.ajax({
            type: 'POST',
            url: fetchUsers,
            contentType: 'application/json',
            headers: headerData,
            data: JSON.stringify(pagingDTO),
            processData: false,
            timeout: 600000,
            success: function (data) {
                var response = data.data;
                $("#loader_dx2").removeClass("show").addClass("hide");

                if (data) {
                    if (data.code === "00") {
                        if (currentPage > 0) {
                            $("#prev").removeClass("hide").addClass("show2");
                        } else {
                            $("#prev").removeClass("show2").addClass("hide");
                        }

                        $("#next").removeClass("hide").addClass("show2");
                        $("#table_data").removeClass("hide").addClass("show");
                        var rows = "";

                        $.each(response, function (key, user) {
                            rows += "<tr id='" + user.id + "' class='pointer'>\n\
                                <td>" + user.firstname + "</td>\n\
                                <td>" + user.lastname + "</td>\n\
                                <td>" + user.email + "</td>\n\
                                <td>" + user.phonenumber + "</td>\n\
                                <td>" + user.dateOfBirth + "</td>\n\
                                <td>" + user.nationality + "</td>\n\
                                <td>" + user.gender + "</td>\n\
                                <td>" + user.createdOn + "</td>\n\
                                <td>" + user.role + "</td>\n\
                                </tr>";
                        });

                        $("#table_body").html(rows);
                    } else {
                        $("#next").removeClass("show2").addClass("hide");
                        $("#info2").text(response).removeClass("success").addClass("error");
                        $("#info2").removeClass("hide").addClass("show");
                    }
                } else {
                    $("#next").removeClass("show2").addClass("hide");
                    $("#info2").text("Error fetching users").removeClass("success").addClass("error");
                    $("#info2").removeClass("hide").addClass("show");
                }
            },
            error: function () {
                $("#info2").text("Error fetching users").removeClass("success").addClass("error");
                $("#info2").removeClass("hide").addClass("show");
                $("#loader_dx2").removeClass("show").addClass("hide");
            }
        });
    }


//    Search one user by pressing enter key
    $("#input_field").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            processImpl();
        }
    });

//    Search one user by clicking search button
    $('#search_button').click(function (e) {
        processImpl();
    });

    function processImpl() {
        var input = $('#input_field').val();

        if (validateInput(input)) {
            $("#view_one").removeClass("hide").addClass("show");
            $("#loader_dx3").removeClass("hide").addClass("show");
            $("#info3").text("").removeClass("error");
            $("#info3").removeClass("show").addClass("hide");

            var headerData = {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'ChannelCode': channelCode
            };
            var fetchUsers = "http://localhost:9797/fast-credit/admin/v1/user/" + input;

            $.ajax({
                type: 'GET',
                url: fetchUsers,
                contentType: 'application/json',
                headers: headerData,
                processData: false,
                timeout: 600000,
                success: function (data) {
                    console.log(data);
                    var response = data.data;
                    $("#loader_dx3").removeClass("show").addClass("hide");

                    if (data) {
                        if (data.code === "00") {
                            $("#table_data2").removeClass("hide").addClass("show");
                            var rows = "<tr class='pointer'>\n\
                                <td>" + response.firstname + "</td>\n\
                                <td>" + response.lastname + "</td>\n\
                                <td>" + response.email + "</td>\n\
                                <td>" + response.phonenumber + "</td>\n\
                                <td>" + response.dateOfBirth + "</td>\n\
                                <td>" + response.nationality + "</td>\n\
                                <td>" + response.gender + "</td>\n\
                                <td>" + response.createdOn + "</td>\n\
                                <td>" + response.role + "</td>\n\
                                </tr>";

                            $("#table_body2").html(rows);
                        } else {
                            $("#table_data2").removeClass("show").addClass("hide");
                            $("#info3").text(response).removeClass("success").addClass("error");
                            $("#info3").removeClass("hide").addClass("show");
                        }
                    } else {
                        $("#table_data2").removeClass("show").addClass("hide");
                        $("#info3").text("Error fetching single users").removeClass("success").addClass("error");
                        $("#info3").removeClass("hide").addClass("show");
                    }
                },
                error: function () {
                    $("#table_data2").removeClass("show").addClass("hide");
                    $("#info3").text("Error fetching single users").removeClass("success").addClass("error");
                    $("#info3").removeClass("hide").addClass("show");
                    $("#loader_dx3").removeClass("show").addClass("hide");
                }
            });
        } else {
            alert("Enter firstname or lastname or username");
        }
    }

//    function selectedGender(){
//        $('[name="gender"]').each(function(index){
//            if($(this))
//        });
//    }


//    $("#viewall").click(function () {
//        window.location.href = "/user-interface/index.html";
//    });

});