(function(){

    var dataChangedEvent = new Event('dataChanged')

    function SW() {
        this.url = '/products'
        this.url2 = '/cart'
        this.products = []
        this.cart = []
    }

    /* get data from the API endpoint and store it locally */
    SW.prototype.getData = function() {

        var self = this

        $.get({
           url: self.url,
           success: function(data) {
                /* store data as a property of this object */
                self.products = data
           }
        })

        $.get({
           url: self.url2,
           success: function(data) {
                /* store data as a property of this object */
                self.cart = data
                /* trigger the data changed event */
                window.dispatchEvent(dataChangedEvent)

           }
        })

    }

    /* return the list of products */
    SW.prototype.getProducts = function() {
        if (this.products === []) {
            return []
        } else {
            return this.products.products
        }
    }
    // return a specific product and its information
    SW.prototype.getProductsinfo = function(Id) {
        let results = this.getProducts()
        if (results === []) {
            return []
        } else {
        for ( var i = 0; i < results.length; i ++){
            if ( results[i].id === Id){
                return results[i];
                }
            }
        }
    }
    // return a list of the cart
    SW.prototype.getCart = function() {
        if (this.cart === []) {
            return []
        } else {
            return this.cart.cart
        }
    }

    /* export to the global window object */
    window.app = window.app || {}
    window.app.SW = SW

})()