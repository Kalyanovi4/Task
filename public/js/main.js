$(document).ready(function(){
    $(".delete").on("click", function() {
        if (confirm("Are you sure?")) {
            var bookName = $(this).parent().find(".bookname").text();
            $.ajax({
                type: "POST",
                data: {name: bookName},
                url: "/books/delete",
                success: function(res) {
                    if (res.status == "Ok") {
                        $(this).parent().remove();
                    }
                    else {
                        alert("Smth went wrong");
                    }
                }
            })
        }
    });
    $(".edit").on("click", function() {
        var bookName = $(this).parent().find(".bookname").text();
        location.href = '/books/editform?name='+ bookName;
    })
});