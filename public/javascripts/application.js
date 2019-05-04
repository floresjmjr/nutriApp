$(function() {

  const Log = {

    loadpage: function() {
      this.addToDB();
      this.deleteFromDB();
      this.servingChange();
    },

    servingChange: function() {
      $('main').on('change', 'select', (e)=>{
        $(e.target).closest('form').submit();
      })
    },

    addToDB: function() {
      $('main').on('click', "button[name='addToLog']", (e)=>{
        const id = $(e.target).val()
        var data = {};
        data['qty'] = $(e.target).closest('ul').find('input').val()
        const request = new XMLHttpRequest();
        request.open('POST', `http://localhost:3000/item/${id}`)
        request.setRequestHeader('Content-type', 'application/json')
        request.send(JSON.stringify(data))
        request.addEventListener('load', (response)=>{
          if(request.status === 200) {
            console.log('was added')
          } else {
            console.log('problem!')
          }
        })
      })
    },

    deleteFromDB: function() {
      $('main').on('click', "button[name='deleteFromLog']", (e)=>{
        const id = $(e.target).val();
        console.log('deleteFood triggered', id)
        const request = new XMLHttpRequest();
        request.open('DELETE', `http://localhost:3000/log/${id}`)
        request.send();
        request.addEventListener('load', ()=>{
          if(request.status === 200) {
            console.log('was deleted')
            this.removeFromDisplay(id);
          } else {
            console.log("wasn't deleted", request.status)
          }
        })
      })
    },

    removeFromDisplay: function(id) {
      console.log('removeFoodFromDisplay', id);
      var button = $('#displayLog button').filter((idx, button)=>{
        return button.value === id;
      })
      button.closest('li').remove();
    },


  }

  Log.loadpage();

//   view = {
//     navHighlight: function() {
//       $('nav ul').on('click', 'li', (e)=>{
//         e.target    //highlight and unhighlight others
//      })
//     }  
//   }

})