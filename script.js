$(document).ready(function() {


   var $calendar = $('#calendar');
   var id = 10;

   $calendar.weekCalendar({
      displayOddEven:true,
      timeslotsPerHour : 2,
      allowCalEventOverlap : true,
      overlapEventsSeparate: true,
      firstDayOfWeek : 1,
      businessHours :{start: 8, end: 22, limitDisplay: true },
      daysToShow : 5,
      switchDisplay: {'1 Day': 1, '3 Days': 3, 'Week': 5},
      title: function(daysToShow) {
			return daysToShow == 1 ? '%date%' : '%start% - %end%';
      },
      height : function($calendar) {
         return $(window).height() - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#aaa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      draggable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      resizable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      eventNew : function(calEvent, $event) {
         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         var titleField = $dialogContent.find("input[name='event']");
         var emailField = $dialogContent.find("input[name='email']");
         var nameField = $dialogContent.find("input[name='name']");


         $dialogContent.dialog({
            modal: true,
            title: "New Calendar Event",
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {
                  let start = new Date(startField.val())
                  let end = new Date(endField.val())
                  let url = "http://book.jacobrichman.com/new.php?email="+emailField.val()+"&start="+start.toISOString()+"&end="+end.toISOString()+"&title="+titleField.val()+"&name="+nameField.val();
                  $.get(url, function(data, status){
                    if(data =="done"){
                      calEvent.id = id;
                      id++;
                      calEvent.start = start;
                      calEvent.end = end;
                      calEvent.title = titleField.val();
                      calEvent.body = emailField.val();
                      calEvent.readOnly = true;

                      $calendar.weekCalendar("removeUnsavedEvents");
                      $calendar.weekCalendar("updateEvent", calEvent);
                      $dialogContent.dialog("close");
                    }
                    else{
                      alert(data)
                    }
                  });
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

      },
      eventDrop : function(calEvent, $event) {

      },
      eventResize : function(calEvent, $event) {
      },
      eventClick : function(calEvent, $event) {

         if (calEvent.readOnly) {
            return;
         }

         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
         var bodyField = $dialogContent.find("textarea[name='body']");
         bodyField.val(calEvent.body);

         $dialogContent.dialog({
            modal: true,
            title: "Edit - " + calEvent.title,
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {

                  calEvent.start = new Date(startField.val());
                  calEvent.end = new Date(endField.val());
                  calEvent.title = titleField.val();
                  calEvent.body = bodyField.val();

                  $calendar.weekCalendar("updateEvent", calEvent);
                  $dialogContent.dialog("close");
               },
               "delete" : function() {
                  $calendar.weekCalendar("removeEvent", calEvent.id);
                  $dialogContent.dialog("close");
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
         $(window).resize().resize(); //fixes a bug in modal overlay size ??

      },
      eventMouseover : function(calEvent, $event) {
      },
      eventMouseout : function(calEvent, $event) {
      },
      noEvents : function() {
        
      },
      data : function(start, end, callback) {
        var events = []
         account_ids.forEach(function(item) {
           let url = 'https://www.googleapis.com/calendar/v3/calendars/'+item+'/events?timeMax='+end.toISOString()+'&timeMin='+start.toISOString()+'&access_token='+access_token;
           $.get(url, function(data, status){
             data.items.forEach(function(event) {
               if(event.start.dateTime){
                 if(event.recurrence){
                   schedulerStart = new Scheduler(new Date(event.start.dateTime), event.recurrence[0], true);
                   occurrencesStart = schedulerStart.occurrences_between(start, end);
                   schedulerEnd = new Scheduler(new Date(event.end.dateTime), event.recurrence[0], true);
                   occurrencesEnd = schedulerEnd.occurrences_between(start, end);
                   
                   for(var i=0;i<occurrencesStart.length;i++){
                     events.push({
                       "id":events.length+1,
                       "start": new Date(occurrencesStart[i]),
                       "end": new Date(occurrencesEnd[i]),
                       "title":/*event.summary*/"",
                       "readOnly":true,
                       dow: [ 1, 4 ]
                     })
                   }
                 }
                 else{
                   events.push({
                     "id":events.length+1,
                     "start": new Date(event.start.dateTime),
                     "end": new Date(event.end.dateTime),
                     "title":/*event.summary*/"",
                     "readOnly":true,
                     dow: [ 1, 4 ]
                   })
                 }
               }
             });
             callback({
              events : events
              });
           });
         });
      }
   });

   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }

   function getEventData(start, end,calEvent,id) {
     

      
   }


   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      $startTimeField.empty();
      $endTimeField.empty();

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

         $timestampsOfOptions.start[timeslotTimes[i].startFormatted] = startTime.getTime();
         $timestampsOfOptions.end[timeslotTimes[i].endFormatted] = endTime.getTime();

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");
   var $timestampsOfOptions = {start:[],end:[]};

   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $timestampsOfOptions.start[$(this).find(":selected").text()];
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
            $endTimeOptions.filter(function() {
               return startTime < $timestampsOfOptions.end[$(this).text()];
            })
            );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });

      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   });


   var $about = $("#about");

   $("#about_button").click(function() {
      $about.dialog({
         title: "About this calendar demo",
         width: 600,
         close: function() {
            $about.dialog("destroy");
            $about.hide();
         },
         buttons: {
            close : function() {
               $about.dialog("close");
            }
         }
      }).show();
   });


});
