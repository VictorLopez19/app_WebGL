const data = {
    "frames": {
        "idle_001.png": {
            "frame": {
                "x": 1,
                "y": 1,
                "w": 16,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 32
            },
            "sourceSize": {
                "w": 16,
                "h": 32
            }
        },
        "idle_002.png": {
            "frame": {
                "x": 19,
                "y": 1,
                "w": 16,
                "h": 31
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 31
            },
            "sourceSize": {
                "w": 16,
                "h": 31
            }
        },
        "idle_003.png": {
            "frame": {
                "x": 37,
                "y": 1,
                "w": 20,
                "h": 30
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 20,
                "h": 30
            },
            "sourceSize": {
                "w": 20,
                "h": 30
            }
        },
        "jump_001.png": {
            "frame": {
                "x": 59,
                "y": 1,
                "w": 19,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 19,
                "h": 32
            },
            "sourceSize": {
                "w": 19,
                "h": 32
            }
        },
        "jump_002.png": {
            "frame": {
                "x": 1,
                "y": 35,
                "w": 19,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 19,
                "h": 32
            },
            "sourceSize": {
                "w": 19,
                "h": 32
            }
        },
        "shoot_001.png": {
            "frame": {
                "x": 22,
                "y": 35,
                "w": 16,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 32
            },
            "sourceSize": {
                "w": 16,
                "h": 32
            }
        },
        "walk_001.png": {
            "frame": {
                "x": 40,
                "y": 35,
                "w": 16,
                "h": 30
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 30
            },
            "sourceSize": {
                "w": 16,
                "h": 30
            }
        },
        "walk_002.png": {
            "frame": {
                "x": 58,
                "y": 35,
                "w": 16,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 32
            },
            "sourceSize": {
                "w": 16,
                "h": 32
            }
        },
        "walk_003.png": {
            "frame": {
                "x": 80,
                "y": 1,
                "w": 16,
                "h": 30
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 30
            },
            "sourceSize": {
                "w": 16,
                "h": 30
            }
        },
        "walk_004.png": {
            "frame": {
                "x": 80,
                "y": 33,
                "w": 16,
                "h": 30
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 30
            },
            "sourceSize": {
                "w": 16,
                "h": 30
            }
        },
        "walk_005.png": {
            "frame": {
                "x": 76,
                "y": 65,
                "w": 16,
                "h": 32
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 32
            },
            "sourceSize": {
                "w": 16,
                "h": 32
            }
        },
        "walk_006.png": {
            "frame": {
                "x": 98,
                "y": 1,
                "w": 16,
                "h": 30
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": 16,
                "h": 30
            },
            "sourceSize": {
                "w": 16,
                "h": 30
            }
        }
    },
    "meta": {
        "app": "http://www.codeandweb.com/texturepacker",
        "version": "1.0",
        "image": "spritesheet.png",
        "format": "RGBA8888",
        "size": {
            "w": 115,
            "h": 98
        },
        "scale": "1"
    }
}

//const canvas = document.getElementById("canvass");
//const ctx = canvas.getContext("2d");
// ctx.fillRect(0, 0, canvas.width, canvas.height)

let mario;
let frames = 0;

class Sprite {
    constructor({ animations = [], data }) {
        this.animations = animations;
        this.animation = "walk";
        this.frame = {};
        this.frameIndex = -1;
        this.data = data;
    }

    advance() {
        if (frames % 12 === 0) {
            this.frameNames = this.animations[this.animation].frames;

            if (this.frameIndex + 1 >= this.frameNames.length) {
                this.frameIndex = 0;
            } else {
                this.frameIndex++;
            }
            this.frame = this.data.frames[this.frameNames[this.frameIndex]].frame;
        }
    }
}

class Character extends Sprite {
    constructor(imageURL, spriteObject, x, y, w, h) {
        super(spriteObject);
        this.x = x || 200;
        this.y = y || 200;
        this.w = w || 30;
        this.h = h || 30;
        this.image = new Image();
        this.image.src = imageURL;
    }

    draw() {
        this.advance();
        ctx.drawImage(
            this.image,
            this.frame.x,
            this.frame.y,
            this.frame.w,
            this.frame.h,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
}

//mario = new Character('./idle_walk.png')

//loop
const update = () => {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw mario here
    mario.draw();
    requestAnimationFrame(update);
};

// uploading async data
// NO USÉ FETCH PARA EL EJEMPLO EN CODEPEN ;)
mario = new Character("./assets/img/spritesheet.png", {
    data,
    animations: {
        walk: {
            name: "walk",
            frames: [
                "walk_001.png",
                "walk_002.png",
                "walk_003.png"
            ]
        },
        idle2: {
            name: "idle2",
            frames: ["idle_001.png", "idle_002.png", "idle_003.png"]
        },
        back: {
            name: "back",
            frames: [
                "walk_004.png",
                "walk_005.png",
                "walk_006.png"
            ]
        },
        jump: {
            name: "jump",
            frames: ["jump_001.png","jump_001.png","jump_001.png"]
        }
    }
});
update();

addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        mario.animation = "back";
    } else if (e.key === "ArrowRight") {
        mario.animation = "walk";
    } else if (e.key === "ArrowUp") {
        mario.animation = "jump";
    }
});
addEventListener("keyup", (e) => {
    mario.animation = "idle2";
});
