'use strict';

  /*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


/**
* creating new part in supply chain
* @param {aircraft.CreatePart} tdtd - the create new part transaction
* @transaction
*/
function createPart(tdtd){
var factory = getFactory();
var NS = 'aircraft';


 console.log(tdtd);
var part = factory.newResource('aircraft','Part',tdtd.newPart.serialNumber);
  console.log("ns");
  
part.serialNumber = tdtd.newPart.serialNumber;
part.description = tdtd.newPart.description;
part.partNumber = tdtd.newPart.partNumber;
part.certificate = 'GOOD';
part.history = [];
part.type = tdtd.newPart.type;
part.creationDate = new Date();

return getAssetRegistry(part.getFullyQualifiedType())
.then (function ( registry)
{
  return registry.add(part);
 
});


}



/**
* destroy the old part 
* @param {aircraft.DestroyPart} destroyPart - the DestroyPart transaction
* @transaction
*/
function DestroyPart(destroyPart) {
    return getAssetRegistry('aircraft.Part')
 .then(function(registry){
    destroyPart.oldPart.certificate ='DESTROY';
     return registry.update(destroyPart.oldPart);  
    
      
    });
}

/** 
* the updating part condition
* @param{aircraft.InspectPart} inspectPart - the InspectPart transaction
* @transaction
*/
function inspectPart(inspectPart)
{
var factory = getFactory();
if(!inspectPart.newCondition){
console.log("no change in condition");
   return ;
 }
 else if(inspectPart.part.certificate !='DESTORY')
  
 {
     return getAssetRegistry('aircraft.Part')
         .then(function(registry)
      {
        inspectPart.part.condition = inspectPart.newCondition;
        if(inspectPart.newCondition >= 8)
        {

       inspectPart.part.certificate = 'GOOD';
        }
        else if(inspectPart.newCondition <= 3)
        {
        inspectPart.part.certificate = 'POOR';
        }
        else
        {
        inspectPart.part.certificate = 'IMPROVES';
        }


      var serviceHistory = factory.newConcept('aircraft','PartServiceHistory');
        serviceHistory.part = factory.newRelationship('aircraft', 'Part', inspectPart.part.serialNumber);
        serviceHistory.mechanic = factory.newRelationship('aircraft', 'Mechanic', inspectPart.mechanic.faaMechanicId);
        serviceHistory.service = 'INSPECT';
        serviceHistory.time = new Date();
       if(inspectPart.plane)
        serviceHistory.plane = factory.newRelationship('aircraft', 'Plane', inspectPart.plane.nNumber);
        inspectPart.part.history.push(serviceHistory);
        console.log(inspectPart.part);
           
       registry.update(inspectPart.part);
       
        if(!inspectPart.mechanic.certification.includes(inspectPart.part.type))
       {
         var x = Math.random().toString(36).substring(3)
         var z = inspectPart.part.type.toString();
         console.log(x);
         var sus = factory.newResource('aircraft','Suspicion',x);
         sus.SuspicionId =x;
          var xz= "The Mechanic doesn't have the required " + z + " Certification to Inspect this Part";
           console.log(xz);
           sus.comments = xz;
           sus.status = "ON_GOING";
           sus.situationNumber = "1";
           sus.time = new Date();
           sus.part = factory.newRelationship('aircraft','Part',inspectPart.part.serialNumber);       
       }
       else {
       return registry.update(inspectPart.part);
       }
    return getAssetRegistry(sus.getFullyQualifiedType())
          .then(function(susRegistry)
                
                {  
      return susRegistry.add(sus);}
         );




        });
     }

}


/** 
* the replacing part condition
* @param{aircraft.AddPartToPlane} addPart - the AddPartToPlane transaction
* @transaction
*/

function addPartToPlane(addPart)
{
  var factory = getFactory();

  if(!addPart.plane.parts)
   {
     addPart.plane.parts = [];
   }
  var factory = getFactory();
  //var add = factory.newConcept('aircraft','PartsOfPlane');
  var partAdd =  factory.newRelationship('aircraft' , 'Part' , addPart.part.serialNumber);
  addPart.plane.parts.push(partAdd);
  //add.id = addPart.part.serialNumber;
	//addPart.plane.parts.push(add);
   console.log(addPart.part);
  
  console.log("before adding to part");
    addPart.part.plane =   addPart.plane.nNumber;
   console.log(addPart.plane.parts.toString());
   
     var serviceHistory = factory.newConcept('aircraft','PartServiceHistory');
   
    serviceHistory.part = factory.newRelationship('aircraft', 'Part', addPart.part.serialNumber);
  	serviceHistory.mechanic = factory.newRelationship('aircraft', 'Mechanic', addPart.mechanic.faaMechanicId);
    serviceHistory.service = 'ADD';
    serviceHistory.time = new Date();
    //serviceHistory.plane = addPart.plane;
    //addPart.part.history.push(",");
  console.log("oooaisajsa");
  addPart.part.history.push(serviceHistory); 
  
 return getAssetRegistry('aircraft.Plane')
 .then(function (planeRegistry){
  // Updating the Plane Registry 
  planeRegistry.update(addPart.plane);
   console.log("oooaisajsa");
   
   //Updating the Suspicion Registry
    if(!addPart.mechanic.certification.includes(addPart.part.type))
       {
         var x = Math.random().toString(36).substring(3)
         var z = addPart.part.type.toString();
         console.log(z);
         var sus = factory.newResource('aircraft','Suspicion',x);
         sus.SuspicionId =x;
          var xz= "The Mechanic doesn't have the required " + z + " Certification to Add this Part to the Plane";
           console.log(xz);
           sus.comments = xz;
           sus.status = "ON_GOING";
           sus.situationNumber = "1";
           sus.time = new Date();
           sus.part = factory.newRelationship('aircraft','Part',addPart.part.serialNumber);       
       }
   else 
   {
       return planeRegistry.update(addPart.plane);
   }
    return getAssetRegistry(sus.getFullyQualifiedType())
          .then(function(susRegistry)
                {  return susRegistry.add(sus);}
         );

  
})
 .then(function(){
 return getAssetRegistry('aircraft.Part')
   .then(function(partsRegistry){
   console.log(addPart.plane);
   return partsRegistry.update(addPart.part);
 });
 });


}

/** 
* the replacing part condition
* @param{aircraft.ReplacePart} replacePart - the Replacepart transaction
* @transaction
*/

function replacePart(replacePart)
{
	if(replacePart.part.type!= replacePart.newPart.type)
    {
    throw new Error("You are replacing different type parts");
    }
  else
  {
 	return getAssetRegistry('aircraft.Plane')
  .then(function(reg)
   {
             //console.log(reg.get(p)); 
            
       		 //reg.get(p);
            //planeReg.get(res);
       		console.log("Entering logs"); 
      		//return reg.get(p)
	
            replacePart.part.plane = null;
      // Updating Logs    
      
      var serviceHistory = getFactory().newConcept('aircraft','PartServiceHistory');
            serviceHistory.part = replacePart.part;
            serviceHistory.mechanic = replacePart.mechanic;
            serviceHistory.service = 'REPLACED';
            serviceHistory.time = new Date();
           // serviceHistory.plane = addPart.plane;
            replacePart.part.history.push(serviceHistory);

            //replacePart.newPart.plane = p ;
            var serviceHistory = getFactory().newConcept('aircraft','PartServiceHistory');
            serviceHistory.part = replacePart.newPart;
            serviceHistory.mechanic = replacePart.mechanic;
            serviceHistory.service = 'REPLACEMENT';
            serviceHistory.time = new Date();
           // serviceHistory.plane = addPart.plane;
            replacePart.newPart.history.push(serviceHistory);
      		replacePart.newPart.plane = replacePart.plane.nNumber;
      //Logs done
      console.log("Logs done");
      //Updating Plane

              
              var cut =(replacePart.plane);
              console.log(cut.parts);
            cut.parts.splice(cut.parts.indexOf(replacePart.part) , 1);
              replacePart.plane = (cut);
               replacePart.plane.parts.push(replacePart.newPart);
			
            return getAssetRegistry('aircraft'+'.Part')
               .then(function(reg1)
                     {
            			 reg1.update(replacePart.part)
return reg1.update(replacePart.newPart);
       				})
      				.then(function()
           			{
           				 return getAssetRegistry('aircraft.Plane')
           				.then(function (planeRegistry)
              		   {
   						var factory = getFactory();
 						 
                        //Suspicion update   
                       if((!replacePart.mechanic.certification.includes(replacePart.part.type))|| (replacePart.part.condition > replacePart.newPart.condition))
                               {
                                 var x = Math.random().toString(36).substring(3)
                                 var z = replacePart.part.type.toString();
                                 console.log(z);
                                 var sus = factory.newResource('aircraft','Suspicion',x);
                                 sus.SuspicionId =x;
                                 if(!replacePart.mechanic.certification.includes(replacePart.part.type))
                                    {
                                  var xz= "The Mechanic doesn't have the required " + z + " Certification to Replace this Part";
                                    }
                                 else if ((replacePart.part.condition > replacePart.newPart.condition))
                                 {
                                 var xz= "The condition of the new part(" + replacePart.newPart.serialNumber + ")is worse than the old part(" + replacePart.part.serialNumber +")";
                                 }
                                 //----------------Both Conditions true
                                 if((!replacePart.mechanic.certification.includes(replacePart.part.type))&&(replacePart.part.condition > replacePart.newPart.condition))
                                 {
                                  var xz = "The Mechanic doesn't have the required " + z + " Certification to Replace this Part. " + "The condition of the new part(" + replacePart.newPart.serialNumber + ")is worse than the old part(" + replacePart.part.serialNumber +")"
                                 }
                                    
                                   console.log(xz);
                                   sus.comments = xz;
                                   sus.status = "ON_GOING";
                                   sus.situationNumber = "1";
                                   sus.time = new Date();
                                   sus.part = factory.newRelationship('aircraft','Part',replacePart.part.serialNumber);  
                                 
                                 return getAssetRegistry(sus.getFullyQualifiedType())
                                  .then(function(susRegistry)
                                        { planeRegistry.update(replacePart.plane);
                                   return susRegistry.add(sus);}
                                 );     
                               }
                           else
                           {
                            return planeRegistry.update(replacePart.plane);
                           }
                           // removed else
                            

   							});
 					});
		} )
  }  
}



/** 
* the replacing part condition
* @param{aircraft.UpdateSuspicious} update - the Replacepart transaction
* @transaction
*/

function updateMessage (update)
{
  update.suspicion.status = "RESOLVED";
  return getAssetRegistry('aircraft.Suspicion')
  .then(function(aa){
   return aa.update(update.suspicion); 
  });
  
}