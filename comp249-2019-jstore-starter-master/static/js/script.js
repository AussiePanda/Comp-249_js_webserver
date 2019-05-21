var result
var boolean = 0;

(function() {

    $(document).ready(function() {

        /* make a model instance and trigger data load */
        window.app.model = new window.app.SW()
        window.app.model.getData()
        /* set up handler for dataChanged event from model */

        $(window).on("dataChanged", function() {
            var products = window.app.model.getProducts()
            var cart = window.app.model.getCart()
            console.log(products)
            // shows the empty cart html
            $(".account-menu").empty()
            $(".account-menu").html("your cart is empty")

            // will list all the products based on inital list
            $("#products").append("<thead><tr><th id='sortPro'> Product </th><th id = 'sortpric'> price </th></tr>")
            for (var i = 0; i < products.length; i++) {
                $("#products").append("<tr><td><a href ='#" + products[i].id + "'>" + products[i].name + "</a></td><td>" + products[i].unit_cost + "</td></tr>")
            }
            $("#products").append("</thead>")

            // if the product id is pressed then this will sort both the product and list alphabetically by product
            $(document).on("click", "#sortPro", function() {
                var array = []
                var sarray = []
                for (var i = 0; i < products.length; i++) {
                    array[i] = products[i].name
                    sarray[i] = products[i]
                }
                array.sort()
                for (var i = 0; i < sarray.length; i++) {
                    for (var j = 0; j < sarray.length; j++) {
                        if (array[i] == products[j].name) {
                            sarray[i] = products[j]
                        }
                    }
                }
                $("#products").empty()
                $("#products").append("<thead><tr><th id='sortPro'> Product </th><th id = 'sortpric'> price </th></tr>")
                for (var i = 0; i < sarray.length; i++) {
                    $("#products").append("<tr><td><a href ='#" + sarray[i].id + "'>" + sarray[i].name + "</a></td><td>" + sarray[i].unit_cost + "</td></tr>")
                }
                $("#products").append("</thead>")
            })


            // if the product id is pressed then this will sort both the product and list numerically  by cost
            $(document).on("click", "#sortpric", function() {
                var array = []
                var sarray = []
                for (var i = 0; i < products.length; i++) {
                    array[i] = products[i].unit_cost
                    sarray[i] = products[i]
                }

                function numsort(a, b) {
                    if (a > b) {
                        return 1;
                    } else if (b > a) {
                        return -1;
                    } else {
                        return 0;
                    }
                }

                array.sort(numsort)

                for (var i = 0; i < sarray.length; i++) {
                    for (var j = 0; j < sarray.length; j++) {
                        if (array[i] == products[j].unit_cost) {
                            sarray[i] = products[j]
                        }
                    }
                }
                $("#products").empty()
                $("#products").append("<thead><tr><th id='sortPro'> Product </th><th id = 'sortpric'> price </th></tr>")
                for (var i = 0; i < sarray.length; i++) {
                    $("#products").append("<tr><td><a href ='#" + sarray[i].id + "'>" + sarray[i].name + "</a></td><td>" + sarray[i].unit_cost + "</td></tr>")
                }
                $("#products").append("</thead>")
            })


            $(document).on("click", "#products a", function() {
                //updates cart contents
                var cart = window.app.model.getCart()
                if (result != null) {
                    cart = result
                }
                //when item is clicked this will insert into the relative html showing product information
                var ID = $(this).attr('href')
                ID = parseInt(ID.substring(1))
                var thisproduct = window.app.model.getProductsinfo(ID)
                $("#product_Expansion_heading").html("<h2>" + thisproduct.name + "</h2>  <button class='products'>Close</button>")
                $("#product_Expansion_img").html("<img src=" + thisproduct.image_url + ">")
                $("#product_Expansion_inventory").html("<p>there are " + thisproduct.inventory + " left</p>")
                $("#product_Expansion_price").html("<p> cost $" + thisproduct.unit_cost + "</p>")
                $("#product_Expansion_description").html("<P>" + thisproduct.description + "</p>")
                $("#form").html("<fieldset><ul><li>Product ID: <input type=number name=productid id = productID value = " + thisproduct.id + " disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID></li><li> <input type=submit> </li></ul><input type=hidden name=update value=0></fieldset>")
                //show this form if there is already current slescted item in cart
                if (boolean == 1) {
                    for (var i = 0; i < cart.cart.length; i++) {
                        if (thisproduct.id == cart.cart[i].id) {
                            $("#form").empty()
                            $("#form").html("<fieldset><legend>This item was found in the cart, if you wish to remove type 0 into the quantity field </legend><ul><li>Product: <input type=number name=productid id = productID value = " + thisproduct.id + " disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID></li><li> <input type=submit> </li></ul><input type=hidden name=update value=1></fieldset>")
                            return
                        }
                    }
                }
                //close button will close the extensive information
                $(".products").click(function() {
                    $("#product_Expansion_heading").empty()
                    $("#product_Expansion_img").empty()
                    $("#product_Expansion_inventory").empty()
                    $("#product_Expansion_price").empty()
                    $("#product_Expansion_description").empty()
                    $("#form").empty()
                })
            })
        })

        //this function will send the forms post request and get back its information without refreshing
        $("#form").submit(function(e) {
            e.preventDefault();
            pid = $('#productID').val()
            qid = $('#quantityID').val()
            $.post({
                async: false,
                url: '/cart',
                data: {
                    productid: pid,
                    quantity: qid
                },
                success: callback,
                error: function() {
                    alert('nay')
                }
            })
        });
        //above function calls this to set information
        function callback(data) {
            result = data
            boolean = 1
            updatecart(data)
        }

        // updates the visual cart representation on the page
        function updatecart(data) {
            if (boolean == 1) {
                if (data.cart.length >= 1) {
                    var num = 0;
                    var cost = 0
                    for (var i = 0; i < data.cart.length; i++) {
                        num = num + data.cart[i].quantity
                        cost = cost + data.cart[i].cost
                    }
                    $(".account-menu").empty()
                    $(".account-menu").append("<li> your cart has :" + num + " items </li>")
                    $(".account-menu").append("<li> your cart currently costs: $" + cost.toFixed(2) + " </li>")

                } else {
                    $(".account-menu").empty()
                    $(".account-menu").append("your cart is empty")
                }
            }
        }
    })
})()