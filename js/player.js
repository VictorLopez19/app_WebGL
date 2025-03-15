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


//update();

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
