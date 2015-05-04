# ng-contextmenu

[bootstrap]: http://getbootstrap.com
[angular]: http://angularjs.org

> An [angular] module that utilizes [bootstrap]'s dropdown as contextmenu

With this simple angular module you can use bootstrap's dropdown menu's as
contextmenu's menu on various elements (e.g. tables).

![](screen.png)

## Why?

Yes, there are already a few angular modules which add contextmenu similar to this. *But* competition isn't a bad thing right? My goal was to make a tiny module with a very small memory footprint, thus I decided to not use an isolated scope. At the same time, isolated scopes help to keep thing clean and separated, 

## How to use

 * get the contextmenu.(js|css) files from dist/
 * make them available on your page
 * make angular load the module:
```js
var app = angular.module('app', [
  'ngResource',
  'ngRoute',
  'io.dennis.contextmenu'
]);
```
 * define the contextmenu in your template
```html
<!-- contextmenu -->
<div contextmenu="meta.contextmenu" class="dropdown contextmenu">
  <ul class="dropdown-menu" role="menu">
    <li class="dropdown-header">
      {{ meta.contextmenu.$item.email }}
    </li>
    <li>
      <a role="menuitem" tabindex="-1" href
         ng-href="#/user/{{ meta.contextmenu.$item.email }}/edit"
      >
        <span>Edit</span>
      </a>
    </li>
    <li>
      <a role="menuitem" href 
        ng-click="delete( meta.contextmenu.$item )"
      >
        <span>Delete</span>
      </a>
    </li>
  </ul>
</div>
```
 * link it to your html element
```html
<table class="table" contextmenu-container="meta.contextmenu">
  <tr>
    <th>&nbsp;</th>
    <th>User</th>
    <th>Domains</th>
    <th>&nbsp;</th>
  </tr>
  <tr ng-repeat="row in data" contextmenu-item="row">
    <td class="col-center">
      <span class="fa fa-star" ng-show="row.is_admin" />
    </td>
    <td>{{row.email}}</td>
    <td>{{row.domains.join(', ')}}</td>
    <td class="col-center">
      <span class="fa fa-warning" ng-show="!user.maildirCheck.isMaildir" />
    </td>
  </tr>
</table>
```

## example

You can find an example with angular v1.2 and angular v1.3 in the example folder.
