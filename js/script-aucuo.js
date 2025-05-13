
const articleNavs = document.querySelectorAll(".article-nav");

articleNavs.forEach(el => {
    const links = el.querySelectorAll("a.article-nav__link");
    const body = el.querySelector("article-nav__body");

    links.forEach(link => {
        link.addEventListener('click', ()=>{
            document.body.click();
        })
    })
})