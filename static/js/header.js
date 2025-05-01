class headerModel {
}

class headerView{
	element = {
		title : document.querySelector('.header__title'),
		Forecast : document.querySelector('#forecast'),
		Radar : document.querySelector('#radar'),
		Notify : document.querySelector('#notify')
 	}
}

class headerController{
	constructor(view) {
		this.view = view;
	}

	init(){
		this.view.element.title.addEventListener("click",()=>{
			this.GoHome("/");
		});
		this.view.element.Forecast.addEventListener("click",()=>{
			this.GoHome("/weater");
		})
		this.view.element.Radar.addEventListener("click",()=>{
			this.GoHome("/radar");
		})
		this.view.element.Notify.addEventListener("click",()=>{
			this.GoHome("/notify");
		})
		
	};

	GoHome(url){
		location.href = url;
	};
}

document.addEventListener("DOMContentLoaded", () => {
	const view = new headerView();
	const controller = new headerController(view);
	controller.init();  
});