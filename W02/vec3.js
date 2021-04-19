class Vec3
{
    // Constructor
    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Add method
    add( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    // Sum method
    sum()
    {
        return this.x + this.y + this.z;
    }

    // Min method
    min()
    {
        if ( this.x < this.y ){
            if ( this.x < this.z ){
                return this.x;
            } else {
                return this.z;
            }
        } else {
            if ( this.y < this.z ){
                return this.y;
            } else {
                return this.z;
            }
        }
    }

    // Max method
    max()
    {
        if ( this.x < this.y ){
            if ( this.z < this.y ){
                return this.y;
            } else {
                return this.z;
            }
        } else {
            if ( this.z < this.x ){
                return this.x;
            } else {
                return this.z;
            }
        }
    }

    // Mid method
    mid()
    {
        if ( this.x < this.y ){
            if ( this.z < this.x ){
                return this.x;
            } else if ( this.y < this.z ){
                return this.y;
            } else {
                return this.z;
            }
        } else {
            if ( this.z < this.y ){
                return this.y;
            } else if ( this.x < this.z ){
                return this.x;
            } else {
                return this.z;
            }
        }
    }
}

Vec3.prototype.AreaOfTriangle = function(v1,v2,v3)
{
    var v1v2 = ((v1.x-v2.x) ** 2) + ((v1.y-v2.y) ** 2) + ((v1.z-v2.z) ** 2);
    var v1v3 = ((v1.x-v3.x) ** 2) + ((v1.y-v3.y) ** 2) + ((v1.z-v3.z) ** 2);
    var a = (v1.x-v2.x)*(v1.x-v3.x) + (v1.y-v2.y)*(v1.y-v3.y) + (v1.z-v2.z)*(v1.z-v3.z);
    var S = Math.sqrt( v1v2 * v1v3 - ( a ** 2) ) / 2;
    return S;
}