(function() {

    $(document).ready(function() {

        /* make a model instance and trigger data load */
        window.app.model = new window.app.SW()
        window.app.model.getData()
        var result = []
        /* set up handler for dataChanged event from model */

        $(window).on("dataChanged", function() {
            //get the product and cart list from the database
            var products = window.app.model.getProducts()
            var cart = window.app.model.getCart()

            /*This function will go through the cart and update the total quantity (num) and the total cost (cost) to decimal figures
               If there is no cart then this function will show an empty cart state*/
            if (cart.length > 0) {
                var num = 0;
                var cost = 0
                for (var i = 0; i < cart.length; i++) {
                    num = num + cart[i].quantity
                    cost = cost + cart[i].cost
                }
                $(".cart-menu").empty()
                $(".cart-menu").append("<li> your cart has " + num + " items </li>")
                $(".cart-menu").append("<li> your cart currently costs: $" + cost.toFixed(2) + " </li>")
            } else {
                $(".cart-menu").empty()
                $(".cart-menu").html("your cart is empty")
            }

            // This will fillout the products Div tag with the correct product information given the default sorting method
            $("#products").append("<thead><tr><th id='sortPro'> Product </th><th id = 'sortpric'> price </th></tr>")
            for (var i = 0; i < products.length; i++) {
                $("#products").append("<tr><td><a href ='#" + products[i].id + "'>" + products[i].name + "</a></td><td>" + products[i].unit_cost + "</td></tr>")
            }
            $("#products").append("</thead>")

            /*This method will fill out the products table Sorted by the products names.
              this is done through two tempry arrays, "array" has all the names while sarray is a shallow copy of the products list
              The sarray will be sorted then based on the positioning of the names in "array". after this the products will be displayed*/
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


            /*This function will sort the table numerically by cost
            this is done through two tempry arrays, "array" has all the prices while sarray is a shallow copy of the products list
            "array" will be sorted using the numsort function in a accending order,
            The sarray will be sorted then based on the positioning of the prices in "array". after this the products will be displayed*/
            */
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

            //if an element in the table is clicked
            $(document).on("click", "#products a", function() {
                //updates cart contents
                var cart = window.app.model.getCart()
                //updates the cart contents dynamically based on the json /cart call
                if (result != null) {
                    cart = result
                }

                /*this will insert into the relative html showing product information
                it gains ID from the href tag in the products div element parsing it to only show the
                second letter which in our case is the product ID
                */
                var ID = $(this).attr('href')
                ID = parseInt(ID.substring(1))
                var thisproduct = window.app.model.getProductsinfo(ID)
                $("#product_Expansion_heading").html("<h2>" + thisproduct.name + "</h2>")
                $("#product_Expansion_img").html("<img src=" + thisproduct.image_url + ">")
                $("#product_Expansion_inventory").html("<p>there are " + thisproduct.inventory + " left</p>  <button id='close'>Close</button>")
                $("#product_Expansion_price").html("<p> cost $" + thisproduct.unit_cost + "</p>")
                $("#product_Expansion_description").html("<P>" + thisproduct.description + "</p>")
                $("#form").html("<fieldset><ul><li><input type='hidden' name=productid id = productID value = " + thisproduct.id + " disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID min = '0'></li><li><br><input type=submit></li></ul><input type=hidden name=update value=0 id=vallue></fieldset>")

                //show this form if the currently selected item in within the cart
                if (cart.cart.length > 0) {
                    for (var i = 0; i < cart.cart.length; i++) {
                        if (thisproduct.id == cart.cart[i].id) {
                            $("#form").empty()
                            $("#form").html("<fieldset><legend>This item was found in the cart, if you wish to remove type 0 into the quantity field </legend><ul><li><input type='hidden' name=productid id = productID value = " + thisproduct.id + " disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID min = '0'></li><li><br><input type=submit></li></ul><input type=hidden name=update value=1 id=vallue></fieldset>")
                            return
                        }
                    }
                }
            })
        })

        /*  This function will take the forms submit tag and force an "e.preventDefault();" which will stop
        the page from loading. In stead it will send a json query to the /cart url with the relative information
        on success it will call the function callback, on failure it will alert the user */
        $("#form").submit(function(e) {
            e.preventDefault();
            pid = $('#productID').val()
            qid = $('#quantityID').val()
            value = $('#vallue').val()
            $.post({
                async: false,
                url: '/cart',
                data: {
                    productid: pid,
                    quantity: qid,
                    update: value

                },
                success: callback,
                error: function() {
                    alert('failed to add to cart')
                }
            })
        });

        /* sets the parent variable result to the new data (our new cart based on the /cart results from the jquery)
        and calls updatecart */
        function callback(data) {
            result = data
            updatecart(data)

            alert('succesfully added to cart to add to cart, if you wish to update please re click on the item form the list')
        }

        /* this function will update the cart menu graphics with the correct information
        it will be only called if and only if the json is successful */
        function updatecart(data) {
            var num = 0;
            var cost = 0
            if (data.cart.length > 0) {
                for (var i = 0; i < data.cart.length; i++) {
                    num = num + data.cart[i].quantity
                    cost = cost + data.cart[i].cost
                }
                $(".cart-menu").empty()
                $(".cart-menu").append("<li> your cart has " + num + " items </li>")
                $(".cart-menu").append("<li> your cart currently costs: $" + cost.toFixed(2) + " </li>")

            } else {
                $(".cart-menu").empty()
                $(".cart-menu").append("your cart is empty")
            }
        }

        //close button function, if the button is pressed it will close all the relative information
        $(document).on("click", "#close", function() {
            $("#product_Expansion_heading").empty()
            $("#product_Expansion_img").empty()
            $("#product_Expansion_inventory").empty()
            $("#product_Expansion_price").empty()
            $("#product_Expansion_description").empty()
            $("#form").empty()
        })
    })
})()