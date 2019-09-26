import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioRolDTO } from './_dto/usuarioRolDTO';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  menus: Menu[] = [];

  usuarioroles:UsuarioRolDTO[]=[];

  usuario ="";
  rol="";

  constructor(public loginService : LoginService, private menuService : MenuService){

  }

  ngOnInit(){
          this.menuService.menuCambio.subscribe(data => {
        console.log("data component:: "+data.indexOf.name.toString);
      this.menus = data;
      
    });
    
    this.loginService.usuarioRol.subscribe(data => {
      this.usuarioroles = data;
      //this.usuario = data.values.arguments.usuario;
      //this.rol= data.values.arguments.rol;
      console.log("usuario:: " +data);
      console.log("rol::" +data);
  });
}
}
