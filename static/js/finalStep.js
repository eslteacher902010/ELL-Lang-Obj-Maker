document.getElementById('copy-button').addEventListener('click', async() =>{
  let text = document.getElementById('objective-preview').textContent
    .replace(/\s+/g, ' ')  // replace all multiple spaces/newlines with a single space
    .trim();               // remove leading/trailing spaces
  try{
  await navigator.clipboard.writeText(text)
  const btn =document.getElementById('copy-button');
  const original= btn.innerText;
  btn.innerText= 'Copied';
  setTimeout(() => btn.innerText= original, 2000);
  }catch (err){
  alert('Failed to copy.');
  }
  });



