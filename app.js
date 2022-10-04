const app = Vue.createApp({
    data(){
        const sound = new Audio("classic-alarm-sound.mp3");

        return {
            CurrentHour: null,
            CurrentMinute: null,
            CurrentSecond: null,

            SetAlarmHour: null,
            SetAlarmMinute: null,
            SetAlarmSecond: null,

            AlarmHour: null,
            AlarmMinute: null,
            AlarmSecond: null,  

            AlarmSound: sound,
            singleton:true,
        }
    },
    mounted() {
        setInterval(() => this.getCurrentTime(), 1000)
        setInterval(() => this.checkAlarm(), 1000)
        
        // Toastr Notification
        toastr.options.closeButton = true;
        toastr.options.newestOnTop = false;
        toastr.options.preventDuplicates = true;
    },
    methods:{
        checkValue(){

            // Function to check if input is a number
            const isNumber = n => {
                return !isNaN(n) && !isNaN(parseInt(n))
            }

            // Check if input is null
            if(this.AlarmHour == null) {
                return "Alarm Hour Type is Required"
            }

            else if(this.AlarmMinute == null) {
                return "Alarm Minute Type is Required"
            }

            else if(this.AlarmSecond == null) {
                return "Alarm Second Type is Required"
            }

            // Check if input is number
            if(!isNumber(this.AlarmHour)) {
                return "Hour is not a number"
            }

            else if(!isNumber(this.AlarmMinute)) {
                return "Minute is not a number"
            }

            else if(!isNumber(this.AlarmSecond)) {
                return "Second is not a number"
            }
            
            // Check if input is negative
            if(parseInt(this.AlarmHour) < 0) {
                return "Alarm Hour Must Be Positive"
            }

            else if(parseInt(this.AlarmMinute) < 0) {
                return "Alarm Minute Must Be Positive"
            }

            else if(parseInt(this.AlarmSecond) < 0) {
                return "Alarm Second Must Be Positive"
            }

            // Check if input between 00 - 23 hours, 00 - 59 minutes, and 00 - 59 seconds
            if(parseInt(this.AlarmHour) > 23) {
                return "Alarm Hour Must Not Exceed 23"
            }

            else if(parseInt(this.AlarmMinute) > 59) {
                return "Alarm Minute Must Not Exceed 59"
            }

            else if(parseInt(this.AlarmSecond) > 59) {
                return "Alarm Second Must Not Exceed 59"
            }

            return ""
        },
        getCurrentTime() {
            const date = new Date();
            let CurrentHour = this.checkSingleDigit(date.getHours())
            let CurrentMinute = this.checkSingleDigit(date.getMinutes())
            let CurrentSecond = this.checkSingleDigit(date.getSeconds())

            this.CurrentHour   = CurrentHour;
            this.CurrentMinute = CurrentMinute;
            this.CurrentSecond = CurrentSecond;
            
        },
        checkSingleDigit (digit) {
            return ('0' + digit).slice(-2)
        },
        setAlarm(){
            const msg = this.checkValue()
            if (msg != "") {
                toastr.error(msg)
                return;
            }

            this.SetAlarmHour = this.AlarmHour
            this.SetAlarmMinute = this.AlarmMinute
            this.SetAlarmSecond = this.AlarmSecond
            
            toastr.success(`Alarm telah ditambahkan pada ${this.SetAlarmHour}:${this.SetAlarmMinute}:${this.SetAlarmSecond}`)

        },
        checkAlarm(){
            if ((this.CurrentHour == this.SetAlarmHour) && (this.CurrentMinute == this.SetAlarmMinute) && (this.CurrentSecond == this.SetAlarmSecond) && (this.singleton == true))
            {
                this.playSound(true)
                this.singleton = false
            }
        },
        playSound(flag){
            if (flag) {
                this.AlarmSound.play();
                toastr.info(`Alarm is Ringing`)
            }

            else {
                this.AlarmSound.pause();
                toastr.info(`Alarm Stopped`)
            }
        },
    }   
})

app.mount("#app");


