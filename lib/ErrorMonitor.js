

class ErrorMonitor {
  errorStart = new Date();
  inError = false;

  consecutiveErrors = 0;

  updateStatus = (hasError) => {
    if (hasError && !this.inError) {
      // an error just started
      this.inError = true;
      this.errorStart = new Date();
      console.log('EM: Possible error detcted')
    } else if (hasError && this.inError) {
      // dont need to do anything
    } else if (this.inError && !hasError) {
      // was an error that went away
      console.log('EM: Possible error cleared');
      this.clear();
    } else {
      // clear everything
      this.clear();
    }
  }

  getSecondsInError = () => {
    if (this.inError) {
      // error is continuing check if we crossed the threshold
      const currentTime = new Date();
      const secPassed = Math.round((currentTime.getTime() - this.errorStart.getTime()) / 1000);
      return secPassed;
    } else {
      return 0;
    }
  }

  clear = () => {
    // clear everything
    this.inError = false;
    this.errorStart = new Date;
  }

}

module.exports = ErrorMonitor;