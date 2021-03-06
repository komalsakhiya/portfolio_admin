import { Component, OnInit } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { AdminService } from '../admin.service';
import { AlertService } from '../alert.service';
import { config } from '../config';
import * as _ from 'lodash';
declare var $: any;


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  addTechnologyForm: FormGroup;
  public Editor = ClassicEditorBuild;
  public model = {
    productsData: '',
    servicesData: '',
    featuresData: ''
  };
  file: any = [];
  allCategory: any = [];
  allTechnology: any = [];
  isValidColor: boolean = false;
  colorCode: any = [];
  colorCodeValue: String = '';
  projectId;
  singleProject: any = [];
  hashtag: any = [];
  allTag: any = [];
  public items = [];
  projectTech: any = [];
  projectCategory: any = [];
  path = config.baseMediaUrl;
  logoFile:any =[]

  constructor(public _adminService: AdminService, public router: Router, public route: ActivatedRoute, public _alertService: AlertService) {
    this.getAllTags();

    this.route.params.subscribe(params => {
      this.projectId = params.id;
      if (this.projectId) {
        this.getProjectById(this.projectId);
      }
    });

    this.addProjectForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      technology: new FormControl('', [Validators.required]),
      colorPalette: new FormControl(''),
      fontFamily: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required]),
      features: new FormControl('', [Validators.required]),
      images: new FormControl(''),
      hashtag: new FormControl('', [Validators.required])
    });

    this.addTechnologyForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      desc: new FormControl(''),
      logo: new FormControl('')
    })
  }

  ngOnInit() {
    // $('#multiple-checkboxes').multiselect({
    //   includeSelectAllOption: true,
    // });
    // $('#multiple-checkboxes').multiselect({
    //   templates: {
    //     li: '<li><a href="javascript:void(0);"><label class="pl-2"></label></a></li>'
    //   }
    // });
    // 

    if (this.router.url.includes('edit')) {
      this.addProjectForm.disable();
    }
    this.getAllCategory();
    this.getAllTechnology();

  }

  /**
   * Get All Tags
   */
  getAllTags() {
    this._adminService.getAllTag().subscribe((res: any) => {
      console.log(res);
      _.forEach(res.data, (tag => {
        this.allTag.push(tag.hashtag);
      }))
      console.log(this.allTag);
      this.items = this.allTag
    }, err => {
      console.log(err);
    })
  }


  /**
   * Get Single Project
   * @param {String} projectId 
   */
  getProjectById(projectId) {
    console.log(projectId);
    this._adminService.getProjectById(projectId).subscribe((res: any) => {
      console.log("single project============>", res);
      this.singleProject = res.data;
      this.model = {
        productsData: res.data.products,
        servicesData: res.data.services,
        featuresData: res.data.features
      };
      this.colorCode = res.data.colorPalette;
      _.forEach(this.singleProject.technology, tech => {
        this.projectTech.push(tech._id);
      });
      console.log('this.singleProject.category', this.singleProject.category)
      // this.projectCategory = this.singleProject.category
      this.addProjectForm.controls.technology.setValue(this.projectTech);
      this.addProjectForm.controls.category.setValue(this.singleProject.category._id);
      // this.addProjectForm.controls.colorPalette.setValue(this.singleProject.colorPalette);
      console.log('this.singleProject==========>', this.singleProject)
    }, err => {
      console.log(err);
    })
  }

  /**
   * Colour validation for plus button
   * @param {object} form 
   */
  validColor(form) {
    const colorregx = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
    if (!form.colorPalette.match(colorregx)) {
      this.isValidColor = false;
    } else {
      this.isValidColor = true;
    }
  }

  /**
   * Add Colour
   * @param  {object} form 
   */
  addColor(form) {
    console.log("==========", form.colorPalette);
    if (this.colorCode.indexOf(form.colorPalette) === -1) {
      this.colorCode.push(form.colorPalette);
    }
    console.log('this.colorCode=========>', this.colorCode)
    $('#inputId').val('');
    this.isValidColor = false;

  }
  /**
   * remove colour from colorcode array
   * @param {number} index 
   */
  removeColor(index) {
    console.log('index========', index);
    this.colorCode.splice(index, 1);
    console.log("remove clor code=======>", this.colorCode)
  }

  /**
   * Methods For ckeditor
   * @param editor 
   */
  public onReadyproducts(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  public onReadyservices(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  public onReadyfeatures(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  public onChangeproducts({ editor }: ChangeEvent) {
    const data = editor.getData();
    console.log(data)
    this.addProjectForm.controls.products.setValue(data);
  }
  public onChangeservices({ editor }: ChangeEvent) {
    const data = editor.getData();
    console.log(data)
    this.addProjectForm.controls.services.setValue(data);
  }
  public onChangefeatures({ editor }: ChangeEvent) {
    const data = editor.getData();
    console.log(data)
    this.addProjectForm.controls.features.setValue(data);
  }

  bannerSelected(event) {
    this.file = event.target.files;
    console.log(this.file)
  }
  resetForm() {
    this.addProjectForm.reset();
    this.model.productsData = '';
    this.model.servicesData = '';
    this.model.featuresData = '';
  }

  /**
   * get All Category list
   */
  getAllCategory() {
    this._adminService.getAllCategory().subscribe((res: any) => {
      console.log('res of all category=========>', res)
      this.allCategory = res.data;
      console.log("=====All category======>", this.allCategory);
    }, err => {
      console.error(err);
    })
  }

  /**
   * Get Technology list
   */
  getAllTechnology() {
    this._adminService.getAllTechnology().subscribe((res: any) => {
      console.log('res of all Technology=========>', res)
      this.allTechnology = res.data;
      console.log("=====All Technology======>", this.allTechnology);
    }, err => {
      console.error(err);
    })
  }

  /**
   * Add Project
   * @param {object} form 
   */
  addProject(form) {
    console.log('data of form==================>', form);
    this.addProjectForm.controls.colorPalette.setValue(this.colorCode);
    const arr = [];
    console.log("============", this.addProjectForm.value);
    _.forEach(form.hashtag, tag => {
      arr.push(tag.display);
    })
    console.log('arrr========>', arr);
    this.addProjectForm.controls.hashtag.setValue(arr);
    const data = new FormData();
    _.forOwn(this.addProjectForm.value, (value, key) => {
      data.append(key, value);
    });
    if (this.file.length > 0) {
      console.log("=========this.s", this.file)
      for (let i = 0; i <= this.file.length; i++) {
        data.append('uploadFile', this.file[i]);
      }
    }
    console.log('data======================>', data);
    this._adminService.addProject(data).subscribe((res: any) => {
      console.log('res of add project=========>', res);
      this.resetForm();
      this.colorCode = [];
      this._alertService.successAlert('Project Added Successfully');
      this.router.navigate(['/project-list'])
    }, err => {
      console.error(err);
      this._alertService.failurAlert();
    })
  }
  /**
   * select logo of technology
   * @param {object} event 
   */
  logoSelected(event) {
    this.logoFile = event.target.files;
    console.log(this.logoFile)
  }

  /**
   * Add Technology logo
   * @param value 
   */
  addIcon(value) {
    console.log('value==========>', value)
    this.addTechnologyForm.value['logo'] = value;
    console.log(this.addTechnologyForm.value['logo']);
    // this.url = this.baseUrl+this.addForm.value['avatar'];
    $('#basicExampleModal').modal('hide');
  }

  /**
   * Add Technology
   * @param {object} data 
   */
  addTechnology(detail) {
    console.log('data value================>', detail);
    const data = new FormData();
    _.forOwn(this.addTechnologyForm.value, (value, key) => {
      data.append(key, value);
    });
    console.log("form data==========>", this.addTechnologyForm.value)
    if (this.logoFile.length > 0) {
      console.log("=========this.s", this.logoFile)
      for (let i = 0; i <= this.logoFile.length; i++) {
        data.append('uploadFile', this.logoFile[i]);
      }
    }
    this._adminService.addTechnology(data).subscribe((res: any) => {
      console.log("add technology=========>", res);
      $('#modaladdTechnologyForm').modal('hide');
      this.getAllTechnology();
    }, err => {
      console.log(err)
    })
  }

  /**
   * Update Project
   * @param {object} form 
   */
  updateProject(form) {
    console.log('data of form==================>', form)
    this.addProjectForm.controls.colorPalette.setValue(this.colorCode);
    console.log("============", this.addProjectForm.value);
    const arr = [];
    console.log("============", this.addProjectForm.value);
    _.forEach(form.hashtag, tag => {
      if (tag.display) {
        arr.push(tag.display);
      } else {
        arr.push(tag);
      }
    })
    console.log('arrr========>', arr);
    this.addProjectForm.controls.hashtag.setValue(arr);
    console.log(this.addProjectForm.value)
    const data = new FormData();
    _.forOwn(this.addProjectForm.value, (value, key) => {
      data.append(key, value);
    });
    if (this.file.length > 0) {
      for (let i = 0; i <= this.file.length; i++) {
        data.append('uploadFile', this.file[i]);
      }
    }
    console.log('data==in update====================>', data);
    this._adminService.updateProject(data, this.projectId).subscribe((res: any) => {
      console.log('res of add project=========>', res);
      this.resetForm();
      this._alertService.successAlert('Project Updated Successfully');
      this.router.navigate(['/project-list'])
    }, err => {
      console.error(err);
      this._alertService.failurAlert();
    })
  }
}
