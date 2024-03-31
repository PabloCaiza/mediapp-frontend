import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../services/login.service";
import { MenuService } from "../services/menu.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment.development";
import { map } from "rxjs";
import { Menu } from "../model/menu";

export const certGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const loginService = inject(LoginService);
    const menuService = inject(MenuService);
    const router = inject(Router);

    //1) VERIFICAR SI EL USUARIO ESTA LOGUEADO
    const rpta = loginService.isLogged();
    if(!rpta){
        loginService.logout();
        return false;
    }
    //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if(!helper.isTokenExpired(token)){
        //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESE COMPONENTE 'PAGINA'
        //url -> /pages/patient
        const url = state.url;
        const decodedToken = helper.decodeToken(token);
        //const username = decodedToken.sub;
        const username = decodedToken.preferred_username;

        return menuService.getMenusByUser(username).pipe( map( (data: Menu[])=> {
            menuService.setMenuChange(data);

            let count = 0;
            for(let m of data)            {
                if(url.startsWith(m.url)){
                    count++;
                    break;
                }
            }

            if(count > 0){
                return true;
            }else{
                router.navigate(['/pages/not-403']);
                return false;
            }
        }));

    }else{
        loginService.logout();
        return false;
    }    
}