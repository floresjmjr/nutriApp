// $(function() {

//   view = {
//     navHighlight: function() {
//       $('nav ul').on('click', 'li', (e)=>{
//         e.target    //highlight and unhighlight others
//      })
//     }  
//   }



//   function filterData(arr) {
//     var sorted = arr.sort();
//     return sorted.map((item)=> {
//       return item.name;
//     })
//   }
//   var searchQuery = 'act ll butter';
//   var encodedQuery = encodeURIComponent(searchQuery)
//   var dataSource = '';   // add & at the end if included.
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://api.nal.usda.gov/ndb/search/?format=json&q=${encodedQuery}&${dataSource}sort=n&max=25&offset=0&api_key=otG2SftWm3WXimTE3iX2OznAWtnHaCB7spWhwEjo`)
//   request.send()
//   request.addEventListener('load', ()=>{
//     if(request.status === 200) {
//       console.log('Ok!!');
//       var jsonObj = JSON.parse(request.response);
//       $('#displayFood').text(filterData(jsonObj.list.item));
//     } else  {
//       console.error("Request wasn't successful", request.status, request.statustext);
//     }
//   })

// //encodeURIComponent('string goes here');

// })