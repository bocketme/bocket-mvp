function chargeUserImage(id) {
  const imageRequest = new XMLHttpRequest();
  imageRequest.onreadystatechange = function(event) {
    if(this.readyState === this.DONE) {
      if(this.status === 200) {
        const image = new Image();
        
      } else {
        console.error('IMPOSSIBLE');
      }
    }
  }
}
