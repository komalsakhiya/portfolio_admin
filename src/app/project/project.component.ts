import { Component, OnInit } from '@angular/core';
import { config } from '../config';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  allProjects: any = [];
  mediaUrl: any = config.baseMediaUrl;
  constructor(public _adminService: AdminService,public router: Router) { }

  ngOnInit() {
    this.getAllProjects();
  }

  getAllProjects() {
    this._adminService.getAllProjects().subscribe((res: any) => {
      console.log('res of all projects=========>',res)
      this.allProjects = res.data;
      console.log("=====All projects======>",this.allProjects);
    }, err => {
      console.error(err);
    })
  }

  addProject(){
    this.router.navigate(['add-project'])
  }

  deleteProject(projectId){
    console.log(projectId);
    this._adminService.deleteProject(projectId).subscribe((res:any)=>{
      console.log(res);
      this.getAllProjects();
    },err=>{
      console.log(err)
    })
  }

}