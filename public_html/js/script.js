//$(document).contextmenu(function(){
//    return false;
//});

$(document).ready(function () {
    var channelCode = "WEB_01";
    var EMPTY_STRING = "";

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
    });

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
                        if (data) {
                            if (data.code === "00") {
                                $("#loader_dx").removeClass("show").addClass("hide");
                                $("#loginModal").removeClass("show").addClass("hide");
                                localStorage.setItem('token', data.data.access_token);
                                resetLoginForm();

                                if (response.role === "ADMIN") {
                                    window.location.href = "/user-interface/admin.html";
                                } else {
                                    window.location.href = "#";
                                }
                            } else {
                                $("#info").text(response).addClass("error");
                                $("#info").removeClass("hide").addClass("show");
                                $("#loader_dx").removeClass("show").addClass("hide");
                            }
                        } else {
                            $("#info").text("Error logging in").addClass("error");
                            $("#info").removeClass("hide").addClass("show");
                            $("#loader_dx").removeClass("show").addClass("hide");
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

                    if (data) {
                        if (data.code === "00") {
                            $("#loader_dx").removeClass("show").addClass("hide");
                            $("#loginModal").removeClass("show").addClass("hide");

                            resetNewCustomerForm2();
                        } else {
                            $("#info1").text(response).removeClass("success").addClass("error");
                            $("#info1").removeClass("hide").addClass("show");
                            $("#loader_dx1").removeClass("show").addClass("hide");
                        }
                    } else {
                        $("#info1").text("Error saving new user").removeClass("success").addClass("error");
                        $("#info1").removeClass("hide").addClass("show");
                        $("#loader_dx1").removeClass("show").addClass("hide");
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
        $("#view_all").removeClass("hide").addClass("show");
    });








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

        } else {
//            $('#data_table_DIV').removeClass("show").addClass("hide");
//            $('#bookmark').removeClass("show").addClass("hide");
//            $('#display_results').addClass("info_x").html("Please enter username...");
//            $('#display_results').removeClass("spinnerA").addClass("ext");
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