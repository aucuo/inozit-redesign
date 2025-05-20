
import "./datepicker.js"
import "./input-counter.js"

const articleNavs = document.querySelectorAll(".article-nav");

articleNavs.forEach(el => {
    const links = el.querySelectorAll("a.article-nav__link");

    links.forEach(link => {
        link.addEventListener('click', ()=>{
            document.body.click();
        })
    })
})