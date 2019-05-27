$(function() {

  const Log = {

    rootUrl: function() {
      return window.location.href.split(window.location.pathname)[0]
    },

    loadpage: function() {
      this.addToDB();
      this.deleteFromDB();
      this.servingChange();
    },

    servingChange: function() {
      $('main').on('change', 'select', (e)=>{
        if(e.target.name === 'serving'){
          $(e.target).closest('form').submit();
        }
      })
    },

    addToDB: function() {
      $('main').on('click', "button[name='addToLog']", (e)=>{
        const id = $(e.target).val()
        var data = {};
        data['qty'] = $(e.target).closest('ul').find('input').val()
        const request = new XMLHttpRequest();
        request.open('POST', this.rootUrl() + `/item/${id}`)
        request.setRequestHeader('Content-type', 'application/json')
        request.send(JSON.stringify(data))
        request.addEventListener('load', (response)=>{
          if(request.status === 200) {
            console.log('was added')
            this.messageUser()
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
        request.open('DELETE', this.rootUrl() + `/log/${id}`)
        request.send();
        request.addEventListener('load', ()=>{
          if(request.status === 200) {
            console.log('was deleted')
            this.removeFromDisplay(id);
            location.reload();
          } else {
            console.log("wasn't deleted", request.status)
          }
        })
      })
    },

    messageUser: function() {
      alert('The item you selected has been added')
    },

    removeFromDisplay: function(id) {
      console.log('removeFoodFromDisplay', id);
      var button = $('#displayLog button').filter((idx, button)=>{
        return button.value === id;
      })
      button.closest('tr').remove();
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