
var result
var boolean = 0 ;

(function(){

    $(document).ready(function() {

        /* make a model instance and trigger data load */

        window.app.model = new window.app.SW()
        window.app.model.getData()





        /* set up handler for dataChanged event from model */

        $(window).on("dataChanged", function() {
            var products = window.app.model.getProducts()
            var cart = window.app.model.getCart()



            $("#products").append("<thead><tr><th> Product </th><th> price </th></tr>" )
             for(var i=0; i<products.length; i++) {
                $("#products").append("<tr><td><a href ='#"+ products[i].id + "'>" + products[i].name + "</a></td><td>" + products[i].unit_cost + "</td></tr>")

             }
             $("#products").append("</thead>")

            $("#products a").click(function(){
            var cart = window.app.model.getCart()
            if (result != null){
            cart = result}
            var ID = $(this).attr('href')
            ID = parseInt(ID.substring(1))
            var thisproduct = window.app.model.getProductsinfo(ID)
            $("#product_Expansion_heading").html("<h2>" + thisproduct.name + "</h2>  <button class='products'>Close</button>")
            $("#product_Expansion_img").html("<img src=" + thisproduct.image_url + ">")
            $("#product_Expansion_inventory").html("<p>there are " + thisproduct.inventory + " left</p>")
            $("#product_Expansion_price").html("<p> cost $" + thisproduct.unit_cost + "</p>")
            $("#product_Expansion_description").html("<P>" + thisproduct.description + "</p>")

            $("#form").html("<fieldset><ul><li>Product ID: <input type=number name=productid id = productID value = "+ thisproduct.id +" disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID></li><li> <input type=submit> </li></ul><input type=hidden name=update value=0></fieldset>")

            if(boolean ==1){
            for (var i=0; i<cart.cart.length; i++){
                if(thisproduct.id ==cart.cart[i].id){
                console.log("works")
                $("#form").empty()
                $("#form").html("<fieldset><legend>This item was found in the cart, if you wish to remove type 0 into the quantity field </legend><ul><li>Product: <input type=number name=productid id = productID value = "+ thisproduct.id +" disabled ></li><li>Quantity: <input type=number name=quantity id = quantityID></li><li> <input type=submit> </li></ul><input type=hidden name=update value=1></fieldset>")
                return
                }
            }
            }

            $(".products").click(function(){
            $("#product_Expansion_heading").empty()
            $("#product_Expansion_img").empty()
            $("#product_Expansion_inventory").empty()
            $("#product_Expansion_price").empty()
            $("#product_Expansion_description").empty()
            $("#form").empty()
            })
        })
        })
        $("#form").submit(function(e) {
            e.preventDefault();
            pid = $('#productID').val()
            qid = $('#quantityID').val()
            $.post({
                async: false,
                url:'/cart',
                data: {productid:pid,quantity:qid },
                success: callback,
                error: function(){
            alert('nay')
                }
             })
        });
         function callback(data){
                console.log(data)
                result = data
                boolean = 1
                }

    })
})()

