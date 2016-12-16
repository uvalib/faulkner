// Your code goes here.

function ready(fn) {
  if (document.readyState != 'loading'){
    console.log("hello world");
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}